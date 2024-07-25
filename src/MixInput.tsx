import './MixInput.css'

import React, {
  type FocusEvent,
  type FormEvent,
  type ForwardedRef,
  forwardRef,
  type KeyboardEvent,
  type SyntheticEvent,
  useEffect,
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
      multiline,
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

    useImperativeHandle(ref, () => ({
      element: editorRef.current,
      caretPosition: caretPos,
      insertContent,
    }))

    console.log('caret pos', caretPos)

    useLayoutEffect(() => {
      console.log('useeffect update caret content, newhtlm')
      updateContentAndCaret({
        triggerOnchange: false,
        newHtmlContent: tagValueArrToString({
          valueArr: value,
          showTagDeleteBtn,
          tagClassName,
        }),
      })
      // setCaretPos(3)
      // setCaretPosition(editorRef.current, 3)
    }, [value, tagClassName, showTagDeleteBtn, tagValueArrToString])

    useEffect(() => {
      console.log('set caret post on useeffect, ======== actual', caretPos)
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
      const isZeroWidthSpaceRemoveFromLast =
        isHtmlContentPassed && !isZeroWidthSpace(content.charAt(content.length - 1))
      let updatedCaret = stripHtml(newContentText).length - stripHtml(content).length

      console.log(
        'diff',
        stripHtml(newContentText),
        stripHtml(newContentText).length,
        stripHtml(content),
        stripHtml(content).length,
      )
      console.clear()
      console.log(newContentText.replace(/[\u200B]/g, '#').length, caretPos, newContentText.length)
      console.log('updatedCaret', {
        updatedCaret,
        isHtmlContentPassed,
        isZeroWidthSpaceRemoveFromLast,
      })
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
      const isStartWithTag = newContent.startsWith('<span')
      const isEndWithTag = newContent.endsWith('</span>')

      // let updatedContent = isStartWithTag ? '&ZeroWidthSpace;' + newContent : newContent
      let updatedContent = newContent

      if (isEndWithTag) {
        updatedContent += '&ZeroWidthSpace;'
      }

      // if (isHtmlContentPassed && updatedCaret < 0) {
      //   updatedCaret = 0
      // }

      if (true) {
        setCaretPos((prev) => {
          console.log('set caret in updatecontent and caret', {
            prev,
            updatedCaret,
            isZeroWidthSpaceRemoveFromLast,
          })
          return prev + updatedCaret
        })
      }
      // if (isZeroWidthSpaceRemoveFromLast) {
      //   setCaretPos((prv) => {
      //     console.log('set caret pos prev--', prv)
      //     return prv
      //   })
      // }
      console.log('set content in updatecaretnadcontn', { caretPos })
      setContent(updatedContent)

      // if (isEndWithTag) {
      //   return
      //   setCaretPosition(editorRef.current, caretPos + 1)
      // }

      if (triggerOnchange) {
        onChange?.(nodesToArray(editorRef.current?.childNodes, tagClassName))
      }
    }

    const handleSelectionChange = (e: SyntheticEvent<HTMLDivElement, Event>) => {
      onSelect?.(e)

      // const { endNode: currentNode } = getCaretInfo(editorRef.current)
      // const previousNode = currentNode?.previousSibling
      // const nextNode = currentNode?.nextSibling
      // const isNextNodeIsSpan = nextNode?.nodeName === 'SPAN'
      const newCaretPos = getCaretPosition(editorRef.current)
      // if (e.type === 'select' && newCaretPos === undefined) {
      //   console.log('-----------------------------')
      //   setCaretPos(caretPos + 1)
      //   return
      // }
      // if (
      //   isNextNodeIsSpan &&
      //   previousNode === null &&
      //   caretPos === 1 &&
      //   isZeroWidthSpace(currentNode?.textContent?.at(0))
      // ) {
      //   setCaretPos(0)
      // } else {
      // setCaretPos(caretPos)
      // }
      if (typeof newCaretPos === 'number') {
        console.log('set caret pos (on select)', caretPos, e)
        setCaretPos(newCaretPos)
      }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const key = e.key
      const { endNode: currentNode, endOffset: currentOffset } = getCaretInfo(editorRef.current)
      const previousNode = currentNode?.previousSibling
      const nextNode = currentNode?.nextSibling
      const isNextNodeBr = nextNode?.nodeName === 'BR'
      const zerowidthspaceLength = 1

      if (
        key === 'ArrowLeft' &&
        currentNode &&
        previousNode &&
        isZeroWidthSpace(currentNode.textContent?.at(currentOffset - 1))
      ) {
        e.preventDefault()
        console.log('here')
        const previousNodeIsBr = previousNode.nodeName === 'BR'
        const previousNodeIsSpan = previousNode.nodeName === 'SPAN'

        if (previousNodeIsBr) {
          console.log('set caret pos onekeydown')
          setCaretPos((prv) => prv - 1)
        }
        if (previousNodeIsSpan) {
          console.log('set caret pos onekeydown')
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
          console.log('set caret pos onkeydowna')
          setCaretPos((prv) => prv + 1)
        }
        if (nextNodeIsSpan) {
          setCaretPos((prev) => {
            console.log(
              'set caret pos onkeydowna',
              prev,
              previousNode?.textContent?.length,
              prev + (previousNode?.textContent?.length || 0) + zerowidthspaceLength,
            )
            return prev + (previousNode?.textContent?.length || 0) + zerowidthspaceLength
          })
        }
      }

      // if (key === 'ArrowRight' && currentNode && isNextNodeBr) {
      //   e.preventDefault()
      //   setCaretPos((prv) => prv + 1)
      // }

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
        if (multiline) {
          insertContent({ type: 'line-break' })
        }
      }
      onKeyDown?.(e)
    }

    const handleFocus = (e: FocusEvent<HTMLDivElement, Element>) => {
      console.log('set caret pos on focus')
      setCaretPosition(editorRef.current, caretPos)
      onFocus?.(e)
    }

    const handleOnInput = (e: FormEvent<HTMLDivElement>) => {
      updateContentAndCaret()

      onInput?.(e)
    }

    function insertContent(content: MixInputType.MixInputValue | MixInputType.MixInputValue[]) {
      if (window.getSelection()?.anchorNode?.parentElement !== editorRef.current) {
        // editorRef.current?.focus()
        // setCaretPosition(editorRef.current, caretPos)
        // console.log('focus', window.getSelection()?.anchorNode?.parentElement)
      }

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
          {...(multiline ? { 'aria-multiline': true } : {})}
          {...restProps}
        />
      </>
    )
  },
)

export default MixInput
