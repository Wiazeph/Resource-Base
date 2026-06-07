import type { SchemaTypeDefinition } from 'sanity'

import { category } from './category'
import { tag } from './tag'
import { resource } from './resource'
import { submission } from './submission'

export const schemaTypes: SchemaTypeDefinition[] = [
  category,
  tag,
  resource,
  submission,
]
