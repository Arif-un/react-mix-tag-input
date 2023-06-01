
import { CreateTagElementParams, CreateTagParams, type MixInputValue, Tag, TagValueArrToStringParams } from './MixInputType'

export const DEFAULT_TAG_CLASS = 'mtag'
export const MixInputValueTypes = {
  TAG: 'tag',
  LINE_BREAK: 'line-break',
} as const

export function nodesToArray(nodes: NodeList | undefined, tagsDataRef: TagValueArrToStringParams['tagsDataRef'], withId = false): MixInputValue[] {
  if (!nodes) return []

  const nodeArr = Array.from(nodes)
  const arr: MixInputValue[] = []

  for (let i = 0; i < nodeArr.length; i += 1) {
    const arrItem: Node | HTMLElement = nodeArr[i]
    const lastItem: MixInputValue | undefined = arr.at(-1)
    if (
      arrItem instanceof Node &&
      arrItem.nodeName === '#text' &&
      arrItem.textContent !== '\n' &&
      arrItem.textContent !== ''
    ) {

      const content = removeZeroWidthSpace(arrItem.textContent || '')

      if (typeof lastItem === 'string') {
        arr[arr.length - 1] = lastItem + content
      } else {
        arr.push(content || '')
      }
    }
    if (arrItem instanceof HTMLElement && arrItem.nodeName === 'SPAN') {
      const classes = arrItem?.classList?.value.replace(DEFAULT_TAG_CLASS, '').trim()
      const id = arrItem?.dataset?.id || ''
      arr.push({
        tagId: id,
        type: MixInputValueTypes.TAG,
        label: arrItem.innerHTML || arrItem.innerText,
        ...(classes ? { classes } : {}),
        ...(tagsDataRef.current[id] ? { data: tagsDataRef.current[id] } : {}),
      })
    }
    if (arrItem instanceof HTMLElement && arrItem.nodeName === 'BR') {
      arr.push({ type: MixInputValueTypes.LINE_BREAK })
    }
  }

  return arr
}

function removeZeroWidthSpace(str: string): string {
  return str.replace(/[\u200B]/g, '')
}

export function createTag({ classes, text, id, showTagDeleteBtn }: CreateTagParams): string {
  //&ZeroWidthSpace; is used to prevent the browser from collapsing multiple spaces into one
  return `<span data-id="${id}" class="${DEFAULT_TAG_CLASS} ${classes}" contenteditable="false">${text.trim()}${showTagDeleteBtn ? '<button class="mtag-delete-btn" contenteditable="false" tabindex="-1">×</button>' : ''}</span>&ZeroWidthSpace;`
}

export function tagValueArrToString({ valueArr, showTagDeleteBtn = false, tagsDataRef, componentId }: TagValueArrToStringParams): string {
  if (!Array.isArray(valueArr) || valueArr.length === 0) {
    return ''
  }

  return valueArr.reduce((acc: string, item: MixInputValue) => {
    if (typeof item === 'string') {
      return (acc += item)
    }
    if (typeof item === 'object' && item.type === MixInputValueTypes.TAG) {
      const { label, classes, data } = item as Tag
      const id = uniqueId(componentId)
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

export function uniqueId(componentId: string) {
  const dateString = Date.now().toString(36)
  const randomness = Math.random().toString(36).substr(2)
  return componentId + dateString + randomness
}

export function createTagElement({ componentId, tagsDataRef, showTagDeleteBtn, data }: CreateTagElementParams) {
  const elm = document.createElement('span')
  elm.setAttribute('contentEditable', 'false')
  const id = uniqueId(componentId)
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
  nodeIndex: number
} {
  let foundNode = null
  let currentPos = 0
  const nodes = Array.from(elm.childNodes)

  for (let i = 0; i < nodes.length; i++) {
    const node: Node | Element = nodes[i]
    if (node?.textContent) {
      const textLength = node.textContent.length
      if (currentPos + textLength >= targetPos) {
        foundNode = node
        break
      }
      currentPos += textLength
    }
  }

  if (!foundNode) {
    foundNode = nodes.at(-1)
    currentPos = foundNode?.textContent?.length || 0
  }
  return { foundNode, nodeIndex: currentPos }
}
