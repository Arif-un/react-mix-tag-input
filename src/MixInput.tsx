import './MixInput.css'

import React, {
  type ClipboardEvent,
  type FocusEvent,
  type ForwardedRef,
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from 'react'

import { MixInputProps, MixInputRef, MixInputValue, Tag } from './MixInputType'
import { arrayToHtmlNode, isTag, nodesToArray, tagValueArrToString, traverseNodes } from './utils'

const MixInput = forwardRef((props: MixInputProps, ref: ForwardedRef<MixInputRef>) => {
  const componentId = useId()
  const tagsDataRef = useRef<Record<string, any>>({})
  const { onChange, onClick, value, multiline, placeholder, showTagDeleteBtn = true, readonly = false, onPaste, onKeyDown, onSelect, onFocus, ...restProps } = props
  const contentRef = useRef(tagValueArrToString({ componentId, tagsDataRef, valueArr: value, showTagDeleteBtn }))
  const editorRef = useRef<HTMLDivElement | null>(null)
  const caretPositionRef = useRef<number>(0)

  useEffect(() => {
    if (!editorRef.current) return
    editorRef.current.innerHTML = tagValueArrToString({ componentId, tagsDataRef, valueArr: value, showTagDeleteBtn })
  }, [value])

  const insertContent = (newContent: MixInputValue | MixInputValue[]) => {
    const selection = window.getSelection()
    if (!selection) {
      return
    }

    const range = selection.getRangeAt(0)

    if (range.commonAncestorContainer !== editorRef.current && range.commonAncestorContainer.parentElement !== editorRef.current) {
      return
    }

    range.deleteContents()

    const node = arrayToHtmlNode({
      item: newContent,
      componentId,
      tagsDataRef,
      showTagDeleteBtn,
    })

    let nodeContentLength = 0

    if (Array.isArray(node)) {
      node.forEach((elm) => {
        if (elm) {
          if (elm.nodeName !== 'BR') {
            nodeContentLength += elm.textContent?.length || 0
          }
          if (elm.nodeName === 'SPAN') {
            nodeContentLength += 1
          }
          range.insertNode(elm)
          range.setEndAfter(elm)
        }
      })
    } else {
      if (node) {
        if (node.nodeName !== 'BR') {
          nodeContentLength += node.textContent?.length || 0
        }
        if (node.nodeName === 'SPAN') {
          nodeContentLength += 1
        }
        range.insertNode(node)
        range.setEndAfter(node)
      }
    }

    if (!node) {
      console.error('invalid content')
      return
    }

    contentRef.current = editorRef.current?.innerHTML ?? ''
    caretPositionRef.current += nodeContentLength
    editorRef.current?.focus()
    onChange?.(nodesToArray(editorRef.current?.childNodes, tagsDataRef))
  }

  useImperativeHandle(ref, () => ({
    inputRef: editorRef.current,
    insertContent,
    getValue: () => nodesToArray(editorRef.current?.childNodes, tagsDataRef),
    setCaret: (pos: number) => setCaret(pos),
    caretPosition: caretPositionRef.current,
  }))

  const handleContentChange = () => {
    if (editorRef.current) {
      contentRef.current = editorRef.current.innerHTML
    }
    onChange?.(nodesToArray(editorRef.current?.childNodes, tagsDataRef))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)

    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
    } else if (e.key === 'Enter' && multiline) {
      e.preventDefault()
      insertContent({ type: 'line-break' })
      return
    } else if (e.key === 'Backspace') {
      const { node, charCode } = getCharacterAtCaretPos(getCaretPosition())
      let tagId: string | null = null
      if (node?.previousSibling?.nodeName === 'SPAN') {
        const tagElm = node?.previousSibling as HTMLSpanElement
        tagId = tagElm.getAttribute?.('data-id')
      }
      // when ZeroWidthWhiteSpace detected after tag then remove the tag
      if (tagId && charCode === 8203) {
        e.preventDefault()
        const nodeArr = nodesToArray(editorRef.current?.childNodes, tagsDataRef, true)
        const { label } = nodeArr.find((item) => isTag(item) && item?.tagId === tagId) as Tag
        const filterTagArr = nodeArr.filter((item) => {
          if (isTag(item) && item.tagId === tagId) {
            return false
          }
          return true
        })
        const nodeStr = tagValueArrToString({ valueArr: filterTagArr, componentId, showTagDeleteBtn, tagsDataRef })

        if (editorRef?.current) {
          editorRef.current.innerHTML = nodeStr
        }

        setCaret(caretPositionRef.current - label.length - 1)
      } else if (caretPositionRef.current > 0) {
        caretPositionRef.current -= 1
      }
      return
    } else if (e.key === 'ArrowLeft') {
      const { node, charCode } = getCharacterAtCaretPos(caretPositionRef.current)
      const tagElement = node?.previousSibling as HTMLSpanElement
      const tagId = tagElement?.getAttribute?.('data-id')
      if (tagId && charCode === 8203) {
        e.preventDefault()
        const tag = editorRef.current?.querySelector(`[data-id="${tagId}"]`)
        setCaret(caretPositionRef.current - (tag?.textContent?.length || 0) - 1)
      }
      return
    } else if (e.key === 'ArrowRight') {
      const targetPos = caretPositionRef.current + 1
      const { node } = getCharacterAtCaretPos(targetPos)
      if (node?.nodeName === 'SPAN') {
        e.preventDefault()
        setCaret(caretPositionRef.current + (node?.textContent?.length || 0) + 1)
      }
      return
    } else if (e.key !== 'Delete' && e.key !== 'Tab') {
      caretPositionRef.current += 1
    }
  }

  const handleClicks = (e: SyntheticEvent) => {
    if (e.target instanceof HTMLButtonElement && e.target.classList.contains('mtag-delete-btn')) {
      e.target?.parentElement?.remove()
      onChange?.(nodesToArray(editorRef.current?.childNodes, tagsDataRef))
    }
    onClick?.(e as MouseEvent<HTMLDivElement>)
  }

  function getCaretPosition() {
    let caretOffset = 0

    if (window.getSelection) {
      const selection = window.getSelection()

      if (editorRef.current && selection?.rangeCount && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const preCaretRange = range.cloneRange()
        preCaretRange.selectNodeContents(editorRef.current)
        preCaretRange.setEnd(range.endContainer, range.endOffset)
        caretOffset = preCaretRange.toString().length
      }
    }

    return caretOffset
  }

  useEffect(() => {
    setCaret(caretPositionRef.current)
  }, [caretPositionRef.current, value])

  function setCaret(pos: number) {
    const targetPos = pos
    if (!editorRef.current) {
      return
    }

    const { foundNode, nodeIndex } = traverseNodes(editorRef.current, targetPos)
    if (foundNode?.textContent) {
      const range = document.createRange()
      const sel = window.getSelection()
      if (!sel) return

      if (foundNode?.textContent && foundNode?.textContent.length >= targetPos - nodeIndex) {
        range.setStart(foundNode, targetPos - nodeIndex)
      } else {
        range.setStart(foundNode, foundNode.textContent.length)
      }
      range.collapse(true)

      sel.removeAllRanges()
      sel.addRange(range)
      caretPositionRef.current = pos
    }
  }

  function getCharacterAtCaretPos(pos: number) {
    const targetPos = pos
    const { foundNode, nodeIndex } = traverseNodes(editorRef.current, targetPos)

    if (foundNode?.textContent) {
      const index = targetPos - nodeIndex - 1
      const char = foundNode.textContent[index]
      return { charCode: char?.charCodeAt(0), node: foundNode, nodeIndex, index }
    }
    return {}
  }

  const handleSelectionChange = (e: SyntheticEvent<HTMLDivElement, Event>) => {
    onSelect?.(e)
    caretPositionRef.current = getCaretPosition()

    // prevent place cursor before ZeroWidthWhiteSpace
    const { charCode } = getCharacterAtCaretPos(caretPositionRef.current + 1)
    if (charCode === 8203) {
      caretPositionRef.current += 1
      setCaret(caretPositionRef.current)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const clipboardData = e.clipboardData
    const pastedData = clipboardData.getData('text/plain')
    insertContent(pastedData)
    onPaste?.(e)
  }

  const handleFocus = (e: FocusEvent<HTMLDivElement, Element>) => {
    setCaret(caretPositionRef.current)
    onFocus?.(e)
  }

  return (
    <div
      data-placeholder={placeholder}
      aria-label="input"
      role="textbox"
      tabIndex={0}
      className="mix-tag-input"
      contentEditable={readonly ? false : true}
      ref={editorRef}
      onInput={handleContentChange}
      onKeyDown={handleKeyDown}
      onClick={handleClicks}
      onSelect={handleSelectionChange}
      onPaste={handlePaste}
      onFocus={handleFocus}
      dangerouslySetInnerHTML={{ __html: contentRef.current }}
      {...(multiline ? { 'aria-multiline': true } : {})}
      {...restProps}
    />
  )
})

export default MixInput
