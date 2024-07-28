import './MixInput.css'

import React, {
  type FocusEvent,
  type FormEvent,
  type ForwardedRef,
  forwardRef,
  type KeyboardEvent,
  type SyntheticEvent,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import * as MixInputType from './MixInputType'
import {
  createHtmlContent,
  ELEMENT_NODE,
  getCaretInfo,
  getCaretPosition,
  isZeroWidthSpace,
  nodesToArray,
  removeZeroWidthSpace,
  setCaretPosition,
  split,
  stripHtml,
  tagValueArrToString,
} from './utils'

const MixInput = forwardRef(
  (props: MixInputType.MixInputProps, ref: ForwardedRef<MixInputType.MixInputRef>) => {
    const {
      onChange,
      onInput,
      onKeyDown,
      onSelect,
      onFocus,
      value,
      // multiline,
      placeholder,
      showTagDeleteBtn = false,
      readonly = false,
      tagClassName = 'mtag',
      ...restProps
    } = props

    const componentId = useId()
    const [content, setContent] = useState('')
    const editorRef = useRef<HTMLDivElement | null>(null)
    const [caretPos, setCaretPos] = useState(999)

    if (value === undefined || value === null) {
      console.error('[MixInput] should have value prop but got undefined')
    }

    if (onChange === undefined) {
      console.error('[MixInput] should have onChange prop but got undefined')
    }

    useImperativeHandle(ref, () => ({
      element: editorRef.current,
      caretPosition: caretPos,
      insertContent,
    }))

    useLayoutEffect(() => {
      updateContentAndCaret({
        triggerOnchange: false,
        newHtmlContent: tagValueArrToString({
          valueArr: value,
          showTagDeleteBtn,
          tagClassName,
        }),
      })
    }, [value, tagClassName, showTagDeleteBtn, tagValueArrToString])

    useLayoutEffect(() => {
      setCaretPosition(editorRef.current, caretPos)
    }, [caretPos])

    const updateContentAndCaret = ({
      newHtmlContent,
      triggerOnchange = true,
    }: {
      newHtmlContent?: string
      triggerOnchange?: boolean
    } = {}) => {
      const element = editorRef.current
      if (!element) return
      const isHtmlContentPassed = newHtmlContent !== undefined
      const newContent = isHtmlContentPassed ? createHtmlContent(newHtmlContent) : element.innerHTML
      const newContentText = isHtmlContentPassed
        ? stripHtml(newContent)
        : stripHtml(element.textContent || '')
      const isZeroWidthSpaceRemovedFromFirst =
        isHtmlContentPassed && isZeroWidthSpace(content.charAt(1))

      let updatedCaret = stripHtml(newContentText).length - stripHtml(content).length

      {
        /**
         * input start with text node with some text and end with
         * text node with one character and second-last node is a tag,
         * when remove last character then caret jump to first character
         * to avoid this we check if last char is zerowidthspace and caret is at end
         * then we increase caret by 1
         */
        const isNewContentEndWithZeroWidthSpace = isZeroWidthSpace(
          newContentText.charAt(newContentText.length - 1),
        )
        const isCaretAtEnd = caretPos === newContentText.length - 1
        if (isNewContentEndWithZeroWidthSpace && isCaretAtEnd) {
          updatedCaret += 1
        }
      }

      if (isZeroWidthSpaceRemovedFromFirst) {
        updatedCaret = 1
      }

      const isEndWithTag = newContent.endsWith('</span>')

      let updatedContent = newContent

      if (isEndWithTag) {
        updatedContent += '&ZeroWidthSpace;'
      }

      if (updatedContent.length - updatedCaret < 0) {
        updatedCaret = 0
      }

      setCaretPos((prev) => {
        if (updatedContent.length + updatedCaret < 0) {
          return 0
        }
        return prev + updatedCaret
      })

      setContent(updatedContent)

      if (triggerOnchange) {
        onChange?.(nodesToArray(editorRef.current?.childNodes, tagClassName))
      }
    }

    const handleSelectionChange = (e: SyntheticEvent<HTMLDivElement, Event>) => {
      onSelect?.(e)
      const newCaretPos = getCaretPosition(editorRef.current)
      if (typeof newCaretPos === 'number') {
        setCaretPos(newCaretPos)
      }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const key = e.key
      const { endNode: currentNode, endOffset: currentOffset } = getCaretInfo(editorRef.current)
      const previousNode = currentNode?.previousSibling
      const nextNode = currentNode?.nextSibling
      const zerowidthspaceLength = 1

      if (
        key === 'ArrowLeft' &&
        currentNode &&
        previousNode &&
        isZeroWidthSpace(currentNode.textContent?.at(currentOffset - 1))
      ) {
        e.preventDefault()
        const previousNodeIsBr = previousNode.nodeName === 'BR'
        const previousNodeIsSpan = previousNode.nodeName === 'SPAN'

        if (previousNodeIsBr) {
          setCaretPos((prv) => prv - 1)
        }

        if (previousNodeIsSpan) {
          setCaretPos(
            (prev) => prev - ((previousNode?.textContent?.length || 0) + zerowidthspaceLength),
          )
        }
      }

      if (
        key === 'ArrowRight' &&
        currentNode &&
        nextNode &&
        isZeroWidthSpace(currentNode.textContent?.at(currentOffset))
      ) {
        e.preventDefault()

        const nextNodeIsBr = nextNode.nodeName === 'BR'
        const nextNodeIsSpan = nextNode.nodeName === 'SPAN'

        if (nextNodeIsBr) {
          setCaretPos((prv) => prv + 1)
        }

        if (nextNodeIsSpan) {
          setCaretPos((prev) => {
            return prev + (previousNode?.textContent?.length || 0) + zerowidthspaceLength
          })
        }
      }

      if (
        key === 'Backspace' &&
        currentNode &&
        isZeroWidthSpace(currentNode.textContent?.at(currentOffset - 1)) &&
        currentNode.previousSibling?.nodeType === ELEMENT_NODE &&
        editorRef.current
      ) {
        e.preventDefault()

        editorRef.current.removeChild(currentNode.previousSibling)
        currentNode.textContent = removeZeroWidthSpace(currentNode?.textContent || '')
        updateContentAndCaret()
      }

      if (key === 'Enter') {
        e.preventDefault()
        // if (multiline) {
        //   insertContent({ type: 'line-break' })
        // }
      }
      onKeyDown?.(e)
    }

    const handleFocus = (e: FocusEvent<HTMLDivElement, Element>) => {
      setCaretPosition(editorRef.current, caretPos)
      onFocus?.(e)
    }

    const handleOnInput = (e: FormEvent<HTMLDivElement>) => {
      updateContentAndCaret()

      onInput?.(e)
    }

    function insertContent(content: MixInputType.MixInputValue | MixInputType.MixInputValue[]) {
      const newContentHTML = tagValueArrToString({
        tagClassName,
        showTagDeleteBtn,
        valueArr: Array.isArray(content) ? content : [content],
      })

      const { endNode, endOffset } = getCaretInfo(editorRef.current)

      const isChildNodesEmpty = endNode === editorRef.current

      if (!editorRef.current || !endNode || endNode == null) return
      if (endNode === null) return

      const [leftStr, rightStr] = split(endNode.textContent || '', endOffset)
      const leftTextNode = document.createTextNode(leftStr)
      const rightTextNode = document.createTextNode(rightStr)

      const fragment = document.createDocumentFragment()
      const tempElm = document.createElement('DIV')

      tempElm.innerHTML = newContentHTML

      fragment.append(leftTextNode)
      Array.from(tempElm.childNodes).map((node) => fragment.append(node))
      fragment.append(rightTextNode)

      fragment.normalize()

      if (isChildNodesEmpty) {
        editorRef.current.append(fragment)
      } else {
        editorRef.current.replaceChild(fragment, endNode)
      }

      updateContentAndCaret()
    }

    return (
      <>
        <div
          key={`${componentId}-mix-input`}
          data-placeholder={placeholder}
          aria-label="input"
          role="textbox"
          tabIndex={0}
          className="mix-tag-input"
          contentEditable={readonly ? false : true}
          ref={editorRef}
          onInput={handleOnInput}
          onKeyDown={handleKeyDown}
          onSelect={handleSelectionChange}
          onFocus={handleFocus}
          dangerouslySetInnerHTML={{ __html: content }}
          // {...(multiline ? { 'aria-multiline': true } : {})}
          {...restProps}
        />
      </>
    )
  },
)

export default MixInput
