/**
 * Curated migration map. The old VitePress markdown encodes taxonomy in three
 * places, with overloaded meaning, so a blind import would produce messy data.
 * This file is the single piece of hand-curation that makes the import clean.
 *
 *  - folder            -> TOP-LEVEL category (domain-scoped)
 *  - file (its `# H1`)  -> SUBCATEGORY under that folder's category
 *  - `## heading`       -> a TAG (tech or topic) — never a third category level,
 *                          to keep the tree shallow (decided in the plan).
 */

export type Domain = 'developer' | 'designer' | 'general'
export type TagKind = 'tech' | 'topic' | 'language' | 'general'

/** Folder slug -> top-level category. */
export const FOLDER_CATEGORIES: Record<
  string,
  { title: string; slug: string; icon: string; domain: Domain; order: number }
> = {
  resources: { title: 'Learning Resources', slug: 'resources', icon: 'graduation-cap', domain: 'developer', order: 10 },
  assets: { title: 'Design Assets', slug: 'assets', icon: 'palette', domain: 'designer', order: 20 },
  tools: { title: 'Tools', slug: 'tools', icon: 'wrench', domain: 'developer', order: 30 },
  extensions: { title: 'Extensions', slug: 'extensions', icon: 'puzzle', domain: 'developer', order: 40 },
  'useful-sections': { title: 'Useful Sections', slug: 'useful', icon: 'sparkles', domain: 'general', order: 50 },
}

/** File name (without .md) -> subcategory metadata. parent = its folder category slug. */
export const FILE_SUBCATEGORIES: Record<
  string,
  { title: string; slug: string; icon: string }
> = {
  // resources/
  documents: { title: 'Documentation', slug: 'documentation', icon: 'book-open' },
  videos: { title: 'Video Courses', slug: 'videos', icon: 'play-circle' },
  courses: { title: 'Online Courses', slug: 'courses', icon: 'monitor-play' },
  'certificate-programs': { title: 'Certificate Programs', slug: 'certificate-programs', icon: 'award' },
  'training-code-battles-sites': { title: 'Practice & Code Battles', slug: 'practice', icon: 'swords' },
  'cheat-sheets': { title: 'Cheat Sheets', slug: 'cheat-sheets', icon: 'scroll-text' },
  roadmaps: { title: 'Roadmaps', slug: 'roadmaps', icon: 'map' },
  'github-repositories': { title: 'GitHub Repositories', slug: 'github-repositories', icon: 'github' },
  'resource-search': { title: 'Resource Search', slug: 'resource-search', icon: 'search' },

  // assets/
  'ui-design': { title: 'UI Component Libraries', slug: 'ui-components', icon: 'layout-grid' },
  'libraries-plugins': { title: 'Libraries & Plugins', slug: 'libraries-plugins', icon: 'package' },
  'ready-to-use': { title: 'Ready-to-Use Snippets', slug: 'ready-to-use', icon: 'clipboard-copy' },
  templates: { title: 'Templates', slug: 'templates', icon: 'layout-template' },
  icons: { title: 'Icons', slug: 'icons', icon: 'shapes' },
  colors: { title: 'Colors', slug: 'colors', icon: 'pipette' },
  fonts: { title: 'Fonts', slug: 'fonts', icon: 'type' },
  'stock-media-resources': { title: 'Stock Media', slug: 'stock-media', icon: 'image' },

  // tools/
  'css-generators': { title: 'CSS Generators', slug: 'css-generators', icon: 'paintbrush' },
  hosts: { title: 'Hosting', slug: 'hosting', icon: 'server' },
  api: { title: 'APIs', slug: 'apis', icon: 'plug' },

  // extensions/
  'browser-extensions': { title: 'Browser Extensions', slug: 'browser-extensions', icon: 'chrome' },
  'vscode-extensions': { title: 'VSCode Extensions', slug: 'vscode-extensions', icon: 'code' },

  // useful-sections/
  'ai-tools': { title: 'AI Tools', slug: 'ai-tools', icon: 'bot' },
  'cv-resume-builders': { title: 'CV / Resume Builders', slug: 'resume-builders', icon: 'file-text' },
  'code-snippets': { title: 'Code Snippet Images', slug: 'code-snippet-images', icon: 'image-plus' },
  'mockup-generators': { title: 'Mockup Generators', slug: 'mockup-generators', icon: 'smartphone' },
  'github-generators': { title: 'GitHub Generators', slug: 'github-generators', icon: 'git-merge' },
}

/**
 * `## heading` -> tag. Headings not listed here fall back to a `topic` tag
 * derived from the heading text. Tech stacks are grouped as `tech`.
 */
export const HEADING_TAGS: Record<string, { title: string; slug: string; kind: TagKind }> = {
  // Tech stacks
  HTML: { title: 'HTML', slug: 'html', kind: 'tech' },
  CSS: { title: 'CSS', slug: 'css', kind: 'tech' },
  'SASS/SCSS': { title: 'Sass', slug: 'sass', kind: 'tech' },
  Bootstrap: { title: 'Bootstrap', slug: 'bootstrap', kind: 'tech' },
  'Tailwind CSS': { title: 'Tailwind CSS', slug: 'tailwind', kind: 'tech' },
  'Tailwind CSS Components': { title: 'Tailwind CSS', slug: 'tailwind', kind: 'tech' },
  'Tailwind CSS Gradient': { title: 'Tailwind CSS', slug: 'tailwind', kind: 'tech' },
  JavaScript: { title: 'JavaScript', slug: 'javascript', kind: 'tech' },
  TypeScript: { title: 'TypeScript', slug: 'typescript', kind: 'tech' },
  React: { title: 'React', slug: 'react', kind: 'tech' },
  'React Hooks': { title: 'React', slug: 'react', kind: 'tech' },
  'React Redux': { title: 'React', slug: 'react', kind: 'tech' },
  'React Context': { title: 'React', slug: 'react', kind: 'tech' },
  Vue: { title: 'Vue', slug: 'vue', kind: 'tech' },
  Pinia: { title: 'Vue', slug: 'vue', kind: 'tech' },
  'Nuxt.js': { title: 'Nuxt', slug: 'nuxt', kind: 'tech' },
  'Next.js': { title: 'Next.js', slug: 'nextjs', kind: 'tech' },
  Svelte: { title: 'Svelte', slug: 'svelte', kind: 'tech' },
  Supabase: { title: 'Supabase', slug: 'supabase', kind: 'tech' },
  Git: { title: 'Git', slug: 'git', kind: 'tech' },
  VSCode: { title: 'VSCode', slug: 'vscode', kind: 'tech' },
  Figma: { title: 'Figma', slug: 'figma', kind: 'tech' },

  // Topics
  Interview: { title: 'Interview', slug: 'interview', kind: 'topic' },
  Weather: { title: 'Weather', slug: 'weather', kind: 'topic' },
  'Movie and TV Series': { title: 'Movies & TV', slug: 'movies-tv', kind: 'topic' },
  'Music and Audio': { title: 'Music & Audio', slug: 'music-audio', kind: 'topic' },
  'File and Storage': { title: 'File & Storage', slug: 'file-storage', kind: 'topic' },
  'Task and Project Management': { title: 'Project Management', slug: 'project-management', kind: 'topic' },
  'Social Network': { title: 'Social', slug: 'social', kind: 'topic' },
}

/** Headings that are just visual grouping noise — ignore (resources keep file subcategory only). */
export const IGNORED_HEADINGS = new Set<string>(['Uncategorized'])
