import './MixInput.css'

import React, {
  ChangeEvent,
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

import { MixInputProps, MixInputRef, MixInputValue } from './MixInputType'
import { getCharacterAtCaretPos, getMixInputValueLength, injectInArray, isTag, nodesToArray, separateDataWithId, tagValueArrToString, traverseNodes, ZERO_WIDTH_SPACE_LENGTH } from './utils'


const MixInput = forwardRef((props: MixInputProps, ref: ForwardedRef<MixInputRef>) => {
  const { onChange, onClick, value = [], multiline, placeholder, showTagDeleteBtn = true, readonly = false, onPaste, onKeyDown, onSelect, onFocus, ...restProps } = props
  const componentId = useId()
  const tagsDataRef = useRef<Record<string, any>>({})
  const editorRef = useRef<HTMLDivElement | null>(null)
  const caretPositionRef = useRef<number>(0)
  const [valueArray, setValueArray] = React.useState<MixInputValue[]>(value)


  useEffect(() => {
    const { newValueArray, tagData } = separateDataWithId(value)
    tagsDataRef.current = tagData
    setValueArray(newValueArray)
  }, [value])

  const insertContent = (newContent: MixInputValue | MixInputValue[]) => {
    if (!editorRef.current) {
      return
    }
    const contentLength = editorRef.current?.textContent?.length || 0
    let caretIndex = caretPositionRef.current
    if (caretIndex > contentLength) {
      caretIndex = contentLength
    }

    const newVal = injectInArray(valueArray, newContent, caretIndex)
    const nodeContentLength = getMixInputValueLength(newContent)
    editorRef.current.innerHTML = tagValueArrToString({ componentId, tagsDataRef, valueArr: newVal, showTagDeleteBtn })
    caretPositionRef.current += nodeContentLength
    setValueArray(newVal)
    onChange?.(nodesToArray(editorRef.current?.childNodes, tagsDataRef).updatedValueArray)
  }

  useImperativeHandle(ref, () => ({
    inputRef: editorRef.current,
    insertContent,
    setCaret: (pos: number) => setCaret(pos),
    caretPosition: caretPositionRef.current,
  }))

  const handleContentChange = (e: ChangeEvent<HTMLDivElement>) => {
    const { updatedValueArray, updatedValueArrayWithId } = nodesToArray(e.target.childNodes, tagsDataRef)
    setValueArray(updatedValueArrayWithId)
    onChange?.(updatedValueArray)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)

    if (!editorRef.current) return

    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
    } else if (e.key === 'Enter' && multiline) {
      e.preventDefault()
      insertContent({ type: 'line-break' })
      return
    } else if (e.key === 'Backspace') {
      const { node, charCode } = getCharacterAtCaretPos(editorRef.current, getCaretPosition())
      let tagId: string | null = null
      if (node?.previousSibling?.nodeName === 'SPAN') {
        const tagElm = node?.previousSibling as HTMLSpanElement
        tagId = tagElm.getAttribute?.('data-id')
      }
      // when ZeroWidthWhiteSpace detected after tag then remove the tag
      if (tagId && charCode === 8203) {
        e.preventDefault()

        const tagIndex = valueArray.findIndex((item) => isTag(item) && item?.tagId === tagId)
        const tag = valueArray[tagIndex]
        if (!isTag(tag)) {
          return
        }

        const { label } = tag
        const filterTagArr = valueArray.splice(tagIndex + 1, 1)
        setValueArray(filterTagArr)
        setCaret(caretPositionRef.current - label.length - 1)
      }
      caretPositionRef.current -= 1
      return
      // if (content === '<br>') {
    } else if (e.key === 'ArrowLeft') {
      const { node, charCode } = getCharacterAtCaretPos(editorRef.current, caretPositionRef.current)
      const tagElement = node?.previousSibling as HTMLSpanElement
      const tagId = tagElement.getAttribute?.('data-id')
      if (tagId && charCode === 8203) {
        e.preventDefault()
        // if last node is a tag then need to count extra one zero width space
        const zeroWidthWhiteSpaceLen = isTag(valueArray?.at(-1)) ? ZERO_WIDTH_SPACE_LENGTH * 2 : ZERO_WIDTH_SPACE_LENGTH
        const tag = editorRef.current?.querySelector(`[data-id="${tagId}"]`)
        setCaret(caretPositionRef.current - (tag?.textContent?.length || 0) - zeroWidthWhiteSpaceLen)
      }
      return
    } else if (e.key === 'ArrowRight') {
      const targetPos = caretPositionRef.current + 1
      const { node } = getCharacterAtCaretPos(editorRef.current, targetPos)
      if (node?.nodeName === 'SPAN') {
        e.preventDefault()
        setCaret(caretPositionRef.current + (node?.textContent?.length || 0) + 1)
      }
      return
    } else if (e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'Control') {
      // when frist item is a tag then dont need to increment bcuz there is a zeroWidthWhitespace
      if (isTag(valueArray?.at(0)) && caretPositionRef.current === 1) {
        return
      }
      caretPositionRef.current += 1
    }
  }

  const handleClicks = (e: SyntheticEvent) => {
    if (e.target instanceof HTMLButtonElement && e.target.classList.contains('mtag-delete-btn')) {
      e.target?.parentElement?.remove()
      onChange?.(nodesToArray(editorRef.current?.childNodes, tagsDataRef).updatedValueArray)
    }
    onClick?.(e as MouseEvent<HTMLDivElement>)
  }


  // const getCurrentCursorPosition = () => {
  //   const selection = window.getSelection()
  //   if (selection.rangeCount === 0) return null

  //   const range = selection.getRangeAt(0)
  //   const parent = range.commonAncestorContainer
  //   const nodes = [...parent.childNodes]

  //   let cursorPosition = 0
  //   for (const node of nodes) {
  //     if (node === range.startContainer) {
  //       cursorPosition += range.startOffset
  //       break
  //     } else if (node.nodeType === Node.TEXT_NODE) {
  //       cursorPosition += node.length
  //     } else {
  //       cursorPosition += node.textContent.length
  //     }
  //   }
  //   console.log({ cursorPosition })

  //   return cursorPosition
  // }

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
  }, [caretPositionRef.current, valueArray])

  function setCaret(pos: number) {
    const targetPos = pos
    if (!editorRef.current) {
      return
    }
    let caretNode
    let caretIndex
    const { foundNode, caretIndexInNode } = traverseNodes(editorRef.current, targetPos)
    const range = document.createRange()
    const sel = window.getSelection()
    if (!sel) return

    if (foundNode?.nodeName === '#text' && foundNode?.textContent && foundNode?.textContent.length >= caretIndexInNode) {
      caretNode = foundNode
      caretIndex = caretIndexInNode
    } else if (foundNode?.nodeName === 'SPAN' && foundNode.nextSibling) {
      caretNode = foundNode.nextSibling
      caretIndex = 1
    }

    if (caretNode && caretIndex !== undefined) {
      try {
        range.setStart(caretNode, caretIndex)
      } catch (error) {
        console.log(error)
      }
    } else {
      return
    }
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
    caretPositionRef.current = pos
  }



  const handleSelectionChange = (e: SyntheticEvent<HTMLDivElement, Event>) => {
    onSelect?.(e)
    if (!editorRef.current) return
    caretPositionRef.current = getCaretPosition()
    console.log('cursor pos', caretPositionRef.current)

    // prevent place cursor before ZeroWidthWhiteSpace
    const { charCode } = getCharacterAtCaretPos(editorRef.current, caretPositionRef.current + 1)
    if (charCode === 8203) {
      caretPositionRef.current += 1
      setCaret(caretPositionRef.current)
    }
  }

  const handlePaste = (e: any) => {
    e.preventDefault()
    const clipboardData = e.clipboardData
    const pastedData = clipboardData.getData('text/plain')
    insertContent(pastedData)
    onPaste?.(e)
  }

  return (
    <>
      <input type="number" onBlur={(e) => {
        setCaret(e.target.valueAsNumber)
        editorRef.current?.focus()
      }} />
      <button onClick={() => console.log({ valueArray })}>value arr</button>
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
        // onFocus={handleFocus}
        // dangerouslySetInnerHTML={{ __html: contentRef.current }}
        dangerouslySetInnerHTML={{
          __html: tagValueArrToString({
            componentId,
            tagsDataRef,
            valueArr: valueArray,
            showTagDeleteBtn,
          }),
        }}
        {...(multiline ? { 'aria-multiline': true } : {})}
        {...restProps}
      />
    </>
  )
})

export default MixInput
