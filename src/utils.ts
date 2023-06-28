
import { CreateTagElementParams, CreateTagParams, LineBreak, type MixInputValue, Tag, TagValueArrToStringParams } from './MixInputType'

export const DEFAULT_TAG_CLASS = 'mtag'
export const ZERO_WIDTH_SPACE_LENGTH = 1

export const MixInputValueTypes = {
  TAG: 'tag',
  LINE_BREAK: 'line-break',
} as const

export function nodesToArray(nodes: NodeList | undefined, tagsDataRef: TagValueArrToStringParams['tagsDataRef']): {
  updatedValueArray: MixInputValue[]
  updatedValueArrayWithId: MixInputValue[]
} {
  if (!nodes) return { updatedValueArray: [], updatedValueArrayWithId: [] }
  const nodeArr = Array.from(nodes)
  const updatedValueArray: MixInputValue[] = []
  const updatedValueArrayWithId: MixInputValue[] = []

  for (let i = 0; i < nodeArr.length; i += 1) {
    const arrItem: Node | HTMLElement = nodeArr[i]
    const lastItem: MixInputValue | undefined = updatedValueArray.at(-1)
    if (
      arrItem instanceof Node &&
      arrItem.nodeName === '#text' &&
      arrItem.textContent !== '\n' &&
      arrItem.textContent !== ''
    ) {
      if (arrItem.textContent && arrItem.textContent?.length === 1 && arrItem.textContent?.charCodeAt(0) === 8203) {
        continue
      }
      const content = removeZeroWidthSpace(arrItem.textContent || '')

      if (typeof lastItem === 'string') {
        updatedValueArray[updatedValueArray.length - 1] = lastItem + content
        updatedValueArrayWithId[updatedValueArrayWithId.length - 1] = lastItem + content
      } else {
        updatedValueArray.push(content || '')
        updatedValueArrayWithId.push(content || '')
      }
    }
    if (arrItem instanceof HTMLElement && arrItem.nodeName === 'SPAN') {
      const classes = arrItem?.classList?.value.replace(DEFAULT_TAG_CLASS, '').trim()
      const id = arrItem?.dataset?.id || ''
      const tagObj: any = {
        type: MixInputValueTypes.TAG,
        label: arrItem.innerHTML || arrItem.innerText,
        ...(classes ? { classes } : {}),
        ...(tagsDataRef.current[id] ? { data: tagsDataRef.current[id] } : {}),
      }
      updatedValueArray.push(tagObj)

      tagObj.tagId = id
      updatedValueArrayWithId.push(tagObj)
    }
    if (arrItem instanceof HTMLElement && arrItem.nodeName === 'BR') {
      updatedValueArray.push({ type: MixInputValueTypes.LINE_BREAK })
      updatedValueArrayWithId.push({ type: MixInputValueTypes.LINE_BREAK })
    }
  }
  return { updatedValueArray, updatedValueArrayWithId }
}

function removeZeroWidthSpace(str: string): string {
  return str.replace(/[\u200B]/g, '')
}

function mergeStrings(arr: MixInputValue[]): MixInputValue[] {
  return arr.reduce((acc: MixInputValue[], cur) => {
    const lastItem = acc.at(-1)
    if (typeof lastItem === 'string' && typeof cur === 'string') {
      acc[acc.length - 1] = lastItem + cur
    } else if (cur !== '') {
      acc.push(cur)
    }
    return acc
  }, [])
}

export function getMixInputValueLength(item: MixInputValue | MixInputValue[], length = 0): number {
  if (Array.isArray(item)) {
    return item.reduce((acc, curr) => getMixInputValueLength(curr, acc), length)
  } else if (typeof item === 'string') {
    return item.length + length
  } else if (isTag(item)) {
    return item.label.length + ZERO_WIDTH_SPACE_LENGTH + length
  } else if (isBr(item)) {
    return 1 + length
  }
  return length
}

function insertInsideString(item: string, element: MixInputValue | MixInputValue[], index: number): string | MixInputValue[] {
  if (typeof element === 'string') {
    return item.substring(0, index) + element + item.substring(index)
  } else if (Array.isArray(element)) {
    return [item.substring(0, index), ...element, item.substring(index)]
  } else if (typeof element === 'object') {
    return [item.substring(0, index), element, item.substring(index)]
  }
  return item
}

export function injectInArray(array: MixInputValue[], element: MixInputValue | MixInputValue[], position: number): MixInputValue[] {
  let contentLength = 0
  const newArray = structuredClone(array)

  if (array.length === 0) {
    return Array.isArray(element) ? element : [element]
  }

  for (let i = 0; i < array.length; i++) {
    const item = array[i]
    const itemLength = getMixInputValueLength(item)

    if (contentLength + itemLength >= position) {
      const index = position - contentLength
      if (typeof item === 'string') {
        const newItem = insertInsideString(item, element, index)
        if (typeof newItem === 'string') {
          newArray.splice(i, 1, newItem)
        } else if (Array.isArray(newItem)) {
          newArray.splice(i, 1, ...mergeStrings(newItem))
        }
        return newArray
      } else if (typeof item === 'object' && Array.isArray(element)) {
        newArray.splice(i, 0, ...element)
        return newArray
      }

      if (!Array.isArray(element) && typeof element === 'object' && typeof item === 'object') {
        const index = contentLength + itemLength - position
        if (index === 0) {
          newArray.splice(i + 1, 0, element)
          return newArray
        }
      }
    }
    contentLength += itemLength
  }

  if (position > contentLength) {
    if (Array.isArray(element)) {
      newArray.push(...element)
    } else {
      newArray.push(element)
    }
  }
  return newArray
}

export function createTag({ classes, text, id, showTagDeleteBtn }: CreateTagParams): string {
  //&ZeroWidthSpace; is used to prevent the browser from collapsing multiple spaces into one
  return `<span data-id="${id}" class="${DEFAULT_TAG_CLASS} ${classes}" contenteditable="false">${text.trim()}${showTagDeleteBtn ? '<button class="mtag-delete-btn" contenteditable="false" tabindex="-1">×</button>' : ''}</span>&ZeroWidthSpace;`
}

export function tagValueArrToString({ valueArr, showTagDeleteBtn = false, tagsDataRef, componentId }: TagValueArrToStringParams): string {
  if (!Array.isArray(valueArr) || valueArr.length === 0) {
    return ''
  }
  return valueArr.reduce((acc: string, item: MixInputValue, index: number) => {
    if (typeof item === 'string') {
      return (acc += item)
    }

    if (isTag(item)) {
      const tagPrefix = index === 0 ? '&ZeroWidthSpace;' : ''
      acc += tagPrefix
      const { label, classes, data, tagId } = item as Tag
      const id = tagId || uniqueId()
      if (data) {
        tagsDataRef.current[id] = data
      }
      return (acc += createTag({
        classes: classes || '',
        text: label,
        id,
        showTagDeleteBtn,
      }))
    }
    if (typeof item === 'object' && item.type === 'line-break') {
      return (acc += '<br>')
    }
    return ''
  }, '')
}

export function getCaretOffset(element: HTMLElement | null): number {
  let caretOffset = 0
  const sel = window.getSelection()

  if (sel?.rangeCount && element) {
    const range = sel.getRangeAt(0)
    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(element)
    preCaretRange.setEnd(range.endContainer, range.endOffset)
    caretOffset = preCaretRange.toString().length
  }
  return caretOffset
}

export function separateDataWithId(valueArray: MixInputValue[]) {
  const tagData: Record<string, any> = {}
  const newValueArray = [...valueArray]
  valueArray.forEach((item, i) => {
    if (isTag(item) && 'data' in item) {
      const id = uniqueId()
      tagData[id] = item.data
      newValueArray[i] = { ...item, tagId: id }
    }
  })

  return { tagData, newValueArray }
}

export function uniqueId() {
  const dateString = Date.now().toString(36)
  const randomness = Math.random().toString(36).substring(2)
  return dateString + randomness
}

export function createTagElement({ tagsDataRef, showTagDeleteBtn, data }: CreateTagElementParams) {
  const elm = document.createElement('span')
  elm.setAttribute('contentEditable', 'false')
  const id = uniqueId()
  elm.setAttribute('data-id', id)
  elm.classList.add(DEFAULT_TAG_CLASS)
  elm.innerHTML = data.label

  if (data.classes) {
    elm.classList.add(data.classes)
  }

  if (data.data) {
    tagsDataRef.current[id] = data.data
    elm.setAttribute('data-id', id)
  }

  if (showTagDeleteBtn) {
    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('mtag-delete-btn')
    deleteBtn.setAttribute('contentEditable', 'false')
    deleteBtn.setAttribute('tabIndex', '-1')
    deleteBtn.innerHTML = '&times;'
    elm.appendChild(deleteBtn)
  }

  return elm
}

export function traverseNodes(elm: Element, targetPos: number): {
  foundNode: Node | undefined
  nodeIndex: number,
  caretIndexInNode: number
} {
  let foundNode = null
  let currentPos = 0
  const nodes = Array.from(elm.childNodes)

  if (targetPos >= (elm?.textContent?.length || 0)) {
    return { foundNode: nodes.at(-1), caretIndexInNode: nodes.at(-1)?.textContent?.length || 0, nodeIndex: nodes.length - 1 }
  }

  for (let i = 0; i < nodes.length; i++) {
    const node: Node | Element = nodes[i]
    if (node?.textContent) {
      const textLength = node.textContent.length
      if (currentPos + textLength >= targetPos) {
        foundNode = node
        return {
          foundNode,
          nodeIndex: i,
          caretIndexInNode: targetPos - currentPos,
        }
      }
      currentPos += textLength
    }
  }

  return { foundNode: nodes.at(-1), caretIndexInNode: nodes.at(-1)?.textContent?.length || 0, nodeIndex: nodes.length - 1 }
}

export function getCharacterAtCaretPos(elm: Element, pos: number) {
  const targetPos = pos
  const { foundNode, nodeIndex, caretIndexInNode } = traverseNodes(elm, targetPos)

  if (foundNode?.textContent) {
    const charIndexBack = caretIndexInNode - 1
    const char = foundNode.textContent[charIndexBack]
    return { charCode: char?.charCodeAt(0), node: foundNode, nodeIndex, charIndexBack }
  }
  return {}
}

export function isTag(item: MixInputValue | undefined): item is Tag {
  return typeof item === 'object' && item.type === MixInputValueTypes.TAG
}

export function isBr(item: MixInputValue): item is LineBreak {
  return typeof item === 'object' && item.type === MixInputValueTypes.LINE_BREAK
}
