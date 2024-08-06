import { type HTMLProps } from 'react'

import type { CreateTagParams, MixInputValue, MixInputValues, Tag, TagValueArrToStringParams } from './MixInputType'
import { JSONContent } from '@tiptap/core'

export const ELEMENT_NODE = 1
const TEXT_NODE = 3

export const MixInputValueTypes = {
  TAG: 'tag',
  LINE_BREAK: 'line-break',
} as const

export function isTag(item: MixInputValue): item is Tag {
  return typeof item === 'object' && item.type === MixInputValueTypes.TAG
}

export function findPossibleCaretSetNodeAndIndex(elm: Element, targetPosition: number): {
  node: ChildNode | undefined
  nodeIndex: number | undefined
  possibleCaretIndex: number | undefined
} {
  const nodesArr = Array.from(elm.childNodes)
  const isNegativeTargetPosition = targetPosition < 0
  if (!elm) {
    return {
      possibleCaretIndex: undefined,
      node: undefined,
      nodeIndex: undefined,
    }
  }

  if (isNegativeTargetPosition) {
    return {
      possibleCaretIndex: 0,
      node: isNegativeTargetPosition ? nodesArr[0] : undefined,
      nodeIndex: isNegativeTargetPosition ? nodesArr.length : undefined,
    }
  }

  const isCaretPositionBeforeZeroWidthSpace = isZeroWidthSpace(nodesArr[0]?.textContent) && targetPosition === 0

  if (isCaretPositionBeforeZeroWidthSpace) {
    return {
      node: nodesArr.at(0),
      possibleCaretIndex: 1,
      nodeIndex: 0,
    }
  }

  let currentContentLength = 0
  let previousNodesContentLength = 0

  for (let i = 0; i < nodesArr.length; i++) {
    const node = nodesArr[i]

    if (node.nodeType !== ELEMENT_NODE && node.nodeType !== TEXT_NODE) {
      console.error('invalid child node')
      continue
    }

    currentContentLength += node.textContent?.length || 0

    if (node.nodeType === TEXT_NODE && currentContentLength >= targetPosition) {
      return {
        node,
        possibleCaretIndex: targetPosition - previousNodesContentLength,
        nodeIndex: i,
      }
    }

    if (node.nodeType === ELEMENT_NODE && currentContentLength >= targetPosition) {
      const nextTextNodeIsZeroWidthSpace = isZeroWidthSpace(nodesArr[i + 1]?.textContent)
      return {
        node: nodesArr[i + 1],
        possibleCaretIndex: nextTextNodeIsZeroWidthSpace ? 1 : 0,
        nodeIndex: i + 1,
      }
    }

    previousNodesContentLength += node.textContent?.length || 0
  }

  return {
    node: nodesArr.at(-1),
    nodeIndex: nodesArr.length - 1,
    possibleCaretIndex: nodesArr.at(-1)?.textContent?.length || 0,
  }
}

function objToHtmlAttr(obj: HTMLProps<HTMLSpanElement>): string {
  const keys = Object.keys(obj)
  if (!keys.length) return ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return keys.reduce((acc, key) => acc += `${key}="${(obj as any)[key]}" `, '')
}

export function createTag({ props, tagClassName, showTagDeleteBtn }: CreateTagParams): string {
  const { label, type, class: classes, ...restProps } = props
  if (type !== 'tag') return ''

  //&ZeroWidthSpace; is used to prevent the browser from collapsing multiple spaces into one
  return `<span class="${tagClassName || ''} ${classes || ''}" ${objToHtmlAttr(restProps)}contenteditable="false">${label.trim()}${showTagDeleteBtn ? '<button class="mtag-delete-btn" contenteditable="false" tabindex="-1">×</button>' : ''}</span>`
}

export function isZeroWidthSpace(char: string | undefined | null) {
  if (char === undefined || char === null || char === '') return false
  return char.charCodeAt(0) === 8203
}

export function removeZeroWidthSpace(str: string): string {
  return str.replace(/[\u200B]/g, '')
}

export function setCaretPosition(elm: Element | null, targetCaretPos: number, isBrPlaced: boolean = false) {
  if (!elm) return
  let { node, possibleCaretIndex } = findPossibleCaretSetNodeAndIndex(elm, targetCaretPos)
  console.log('caret set target and possible', { targetCaretPos, possibleCaretIndex, node })
  if (isBrPlaced && node?.nextSibling?.nodeName === 'BR') {
    node = node?.nextSibling.nextSibling || undefined
    possibleCaretIndex = 0
  }

  const range = document.createRange()
  const sel = window.getSelection()
  if (!sel || !node || possibleCaretIndex === undefined) return

  range.setStart(node, possibleCaretIndex)
  range.collapse(true)
  sel.removeAllRanges()
  sel.addRange(range)
}

export function getCaretInfo(element: HTMLElement | null) {
  const caretInfo = {
    range: undefined,
    isCaretInSameNode: undefined,
    endOffset: undefined,
    startOffset: undefined,
    startNode: undefined,
    endNode: undefined,
  }
  if (!element || !window.getSelection) return caretInfo

  const selection = window.getSelection()

  if (element && selection?.rangeCount && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    return {
      range,
      isCaretInSameNode: range.endContainer === range.startContainer,
      endOffset: range.endOffset,
      startOffset: range.startOffset,
      startNode: range.startContainer,
      endNode: range.endContainer,
    }
  }
  return caretInfo
}

export function stripHtml(html: string) {
  const div = document.createElement('DIV')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

export function createHtmlContent(contentStr: string) {
  const div = document.createElement('div')
  div.innerHTML = contentStr
  return div.innerHTML
}

export function getCaretPosition(element: HTMLElement | null) {
  let caretOffset = 0

  if (window.getSelection) {
    const selection = window.getSelection()

    if (element && selection?.rangeCount && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(element)
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      caretOffset = preCaretRange.toString().length
    } else {
      return
    }
  } else {
    return
  }

  return caretOffset
}

export function tagValueArrToString({ tagClassName, valueArr, showTagDeleteBtn = false }: TagValueArrToStringParams): string {
  if (!Array.isArray(valueArr)) {
    console.error('[MixTagInput] Wrong value provided')
    return ''
  }
  if (!valueArr.length) return ''
  console.log('tag value to html')
  return valueArr.reduce((acc: string, item: MixInputValue, i: number) => {

    if (typeof item === 'string') {
      return (acc += item)
    }
    if (isTag(item)) {
      const isFirstItemIsTag = i === 0
      const isLastItemIsTag = i === valueArr.length - 1
      const isPreviousItemIsTag = i > 0 && isTag(valueArr[i - 1])

      if (isFirstItemIsTag || isPreviousItemIsTag) {
        acc += '&ZeroWidthSpace;'
      }

      acc += createTag({
        props: item,
        showTagDeleteBtn,
        tagClassName,
      })

      acc += isLastItemIsTag ? '&ZeroWidthSpace;' : ''

      console.log('==========================', acc)
      return acc
    }
    if (typeof item === 'object' && item.type === 'line-break') {
      // return (acc += '<br>&ZeroWidthSpace;')
      return (acc += '<br>')
    }
    return ''
  }, '')
}


export function nodesToArray(nodes: NodeList | undefined, tagClassName: string = ''): MixInputValue[] {
  if (!nodes) return []

  const nodeArr = Array.from(nodes)
  const arr: MixInputValue[] = []

  for (let i = 0; i < nodeArr.length; i += 1) {
    const arrItem: Node | HTMLElement = nodeArr[i]
    const lastItem: MixInputValue | undefined = arr.at(-1)
    if (
      arrItem.nodeType === TEXT_NODE &&
      arrItem instanceof Node &&
      arrItem.textContent !== '\n' &&
      arrItem.textContent !== '' &&
      removeZeroWidthSpace(arrItem.textContent || '') !== ''
    ) {
      const content = removeZeroWidthSpace(arrItem.textContent || '')

      if (typeof lastItem === 'string') {
        arr[arr.length - 1] = lastItem + content
      } else {
        arr.push(content || '')
      }
    }
    if (arrItem.nodeType === ELEMENT_NODE && arrItem instanceof HTMLElement && arrItem.nodeName === 'SPAN') {
      const attrs: { [key: string]: string } = {}

      for (let i = 0; i < arrItem.attributes.length; i++) {
        const attr = arrItem.attributes[i]

        if (attr.nodeName === 'class') {
          const classes = attr.nodeValue?.replaceAll(new RegExp(tagClassName, 'g'), '').trim()
          if (classes === '') {
            continue
          } else if (classes) {
            attrs[attr.nodeName] = classes
            continue
          }
        }
        if (attr.nodeName === 'contenteditable') {
          continue
        }
        if (attr.nodeName && attr.nodeValue) {
          attrs[attr.nodeName] = attr.nodeValue
        }
      }

      arr.push({
        type: MixInputValueTypes.TAG,
        label: arrItem.textContent || '',
        ...attrs,
      })
    }

    if (arrItem instanceof HTMLElement && arrItem.nodeName === 'BR') {
      arr.push({ type: MixInputValueTypes.LINE_BREAK })
    }
  }

  return arr
}


export function split(str: string, index: number) {
  const result = [str.slice(0, index), str.slice(index)]

  return result
}


// =================================================

function createTagObj(item: JSONContent): Tag {
  return { type: 'tag', attrs: { ...item.attrs } }
}

export function normalizeJsonValue(value: JSONContent, normalizeValue: MixInputValues = []) {
  console.log('normalizeValue', normalizeValue)
  const lastItem = normalizeValue.at(-1)
  if (
    normalizeValue.length === 0 ||
    (Array.isArray(lastItem) && lastItem.length > 0)
  ) {
    normalizeValue.push([])
  }
  value?.map((item: JSONContent) => {
    if (item.type === 'text' && Array.isArray(lastItem)) {
      lastItem.push(item.text)
    }
    if (item.type === 'tag' && Array.isArray(lastItem)) {
      lastItem.push(createTagObj(item))
    }
    if (item.type === 'paragraph' && item.content) {
      normalizeJsonValue(item.content, normalizeValue)
    }
  })

  if (normalizeValue.at(-1)?.length === 0) {
    normalizeValue.pop()
  }
  return normalizeValue
}