import { type MixTagValue } from './MixInputType'

export const DEFAULT_TAG_CLASS = 'mtag'

export function nodesToArray(nodes: NodeList | undefined): MixTagValue[] {
  if (!nodes) return []

  const nodeArr = Array.from(nodes)
  const arr: MixTagValue[] = []

  for (let i = 0; i < nodeArr.length; i += 1) {
    const arrItem: Node | HTMLElement = nodeArr[i]
    const lastItem: MixTagValue | undefined = arr.at(-1)
    if (
      arrItem instanceof Node &&
      arrItem.nodeName === '#text' &&
      arrItem.textContent !== '\n' &&
      arrItem.textContent !== ''
    ) {
      if (typeof lastItem === 'string') {
        arr[arr.length - 1] = lastItem + arrItem.textContent
      } else {
        arr.push(arrItem.textContent || '')
      }
    }
    if (arrItem instanceof HTMLElement && arrItem.nodeName === 'SPAN') {
      const classes = arrItem?.classList?.value.replace(DEFAULT_TAG_CLASS, '').trim()
      arr.push({
        type: 'tag',
        label: arrItem.innerHTML || arrItem.innerText,
        ...(classes ? { classes } : {}),
      })
    }
  }

  return arr
}

export function tagValueArrToString(valueArr: MixTagValue[] | undefined): string {
  if (!Array.isArray(valueArr) || valueArr.length === 0) {
    return ''
  }

  return valueArr.reduce((acc: string, item: MixTagValue) => {
    if (typeof item === 'string') {
      return (acc += item)
    }
    if (typeof item === 'object') {
      const { label, classes } = item
      return (acc += `<span class="${DEFAULT_TAG_CLASS} ${
        classes || ''
      }" contenteditable="false">${label}</span>`)
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
