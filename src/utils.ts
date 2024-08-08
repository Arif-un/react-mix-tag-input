
import type {  MixInputValue, MixInputValues, Tag } from './MixInputType'
import { JSONContent } from '@tiptap/core'

function isTag(item: MixInputValue): item is Tag {
  return typeof item === 'object' && item.type === 'tag'
}

function createTagObj(item: JSONContent): Tag {
  return { type: 'tag', attrs: { ...item.attrs } }
}

export function editorValueToMixInputValue(value: JSONContent[]) {
  const mixInputValues: MixInputValues = []
  value.forEach((line) => {
    if (line.type === 'paragraph') {
      mixInputValues.push([])
      line?.content?.forEach((item) => {
        if (item.type === 'text' && item.text) {
          mixInputValues.at(-1)?.push(item.text)
        }
        if (item.type === 'tag') {
          mixInputValues.at(-1)?.push(createTagObj(item))
        }
      })
    }
  })
  return mixInputValues
}

export function mixInputValueToEditorValue(mixInputValues: MixInputValue[] | MixInputValue[][]) {
  const jsonContent: JSONContent[] = []
  mixInputValues.forEach((item, i) => {
    if (!Array.isArray(jsonContent[i])) {
      jsonContent.push({ type: 'paragraph', content: [] })
    }
    const lastItem = jsonContent.at(-1)
    if (typeof item === 'string' && lastItem?.content) {
      lastItem.content.push({
        type: 'text',
        text: item,
      })
    }
    if (!Array.isArray(item) && isTag(item) && lastItem?.content) {
      lastItem.content.push({
        type: 'tag',
        attrs: { ...item.attrs },
      })
    }
    if (Array.isArray(item)) {
      item.forEach((subItem) => {
        if (typeof subItem === 'string' && lastItem?.content) {
          lastItem.content.push({
            type: 'text',
            text: subItem,
          })
        }
        if (typeof subItem === 'object' && subItem.type === 'tag' && lastItem?.content) {
          lastItem.content.push({
            type: 'tag',
            attrs: { ...subItem.attrs },
          })
        }
      })
    }
  })
  return jsonContent
}