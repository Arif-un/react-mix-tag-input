import { Node } from '@tiptap/core'

/**
 * This extension allows you to create text nodes.
 * @see https://www.tiptap.dev/api/nodes/text
 */
export  default Node.create({
  name: 'text',
  group: 'inline',
})