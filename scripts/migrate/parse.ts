import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, basename, relative } from 'node:path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { toString } from 'mdast-util-to-string'
import type { Root, Heading, ListItem, Link } from 'mdast'

import {
  FILE_SUBCATEGORIES,
  FOLDER_CATEGORIES,
  HEADING_TAGS,
  IGNORED_HEADINGS,
} from './mapping'

export interface ParsedResource {
  name: string
  url: string
  author?: string
  language: string[]
  /** category slugs: [folderCategory, fileSubcategory] */
  categorySlugs: string[]
  /** tag slugs derived from the active `## heading` */
  tagSlugs: string[]
}

const processor = unified().use(remarkParse)

/** Split "[TR] - Name - (author)" into its parts. */
function parseLinkText(raw: string): {
  name: string
  author?: string
  language: string[]
} {
  let text = raw.trim()
  const language: string[] = []

  const langMatch = text.match(/^\[(EN|TR)\]\s*-?\s*/i)
  if (langMatch) {
    language.push(langMatch[1].toLowerCase())
    text = text.slice(langMatch[0].length).trim()
  }

  let author: string | undefined
  const authorMatch = text.match(/\s*-\s*\(([^)]+)\)\s*$/)
  if (authorMatch) {
    author = authorMatch[1].trim()
    text = text.slice(0, authorMatch.index).trim()
  }

  return { name: text, author, language: language.length ? language : ['en'] }
}

/** Recursively collect all link nodes inside a list item (first one wins). */
function firstLink(node: ListItem): Link | undefined {
  let found: Link | undefined
  const visit = (n: { type: string; children?: unknown[] }) => {
    if (found) return
    if (n.type === 'link') {
      found = n as unknown as Link
      return
    }
    if (Array.isArray(n.children)) {
      for (const child of n.children) visit(child as { type: string; children?: unknown[] })
    }
  }
  visit(node as unknown as { type: string; children?: unknown[] })
  return found
}

function parseFile(absPath: string, folder: string, fileKey: string): ParsedResource[] {
  const tree = processor.parse(readFileSync(absPath, 'utf8')) as Root
  const folderCat = FOLDER_CATEGORIES[folder]
  const fileCat = FILE_SUBCATEGORIES[fileKey]
  if (!folderCat || !fileCat) {
    throw new Error(`Unmapped path: ${folder}/${fileKey} — add it to mapping.ts`)
  }

  const baseCategories = [folderCat.slug, fileCat.slug]
  const out: ParsedResource[] = []
  let activeTagSlugs: string[] = []

  for (const node of tree.children) {
    if (node.type === 'heading' && (node as Heading).depth >= 2) {
      const headingText = toString(node).trim()
      if (IGNORED_HEADINGS.has(headingText)) {
        activeTagSlugs = []
        continue
      }
      const mapped = HEADING_TAGS[headingText]
      activeTagSlugs = mapped ? [mapped.slug] : []
    } else if (node.type === 'list') {
      for (const item of node.children) {
        if (item.type !== 'listItem') continue
        const link = firstLink(item as ListItem)
        if (!link || !/^https?:\/\//.test(link.url)) continue
        const { name, author, language } = parseLinkText(toString(link))
        if (!name) continue
        out.push({
          name,
          url: link.url,
          author,
          language,
          categorySlugs: baseCategories,
          tagSlugs: [...activeTagSlugs],
        })
      }
    }
  }
  return out
}

/** Walk the migration source tree and parse every mapped markdown file. */
export function parseAll(sourceDir: string): ParsedResource[] {
  const results: ParsedResource[] = []
  for (const folder of Object.keys(FOLDER_CATEGORIES)) {
    const folderPath = join(sourceDir, folder)
    let entries: string[]
    try {
      entries = readdirSync(folderPath)
    } catch {
      continue
    }
    for (const entry of entries) {
      const abs = join(folderPath, entry)
      if (!entry.endsWith('.md') || !statSync(abs).isFile()) continue
      const fileKey = basename(entry, '.md')
      if (!FILE_SUBCATEGORIES[fileKey]) {
        console.warn(`  ⚠ skipping unmapped file: ${relative(sourceDir, abs)}`)
        continue
      }
      results.push(...parseFile(abs, folder, fileKey))
    }
  }
  return results
}
