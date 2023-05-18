import './MixInput.css'

import React, {
  type ForwardedRef,
  forwardRef,
  type KeyboardEvent,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'

import type { MixInputProps, MixInputRef, MixInputValue } from './MixInputType'
import { DEFAULT_TAG_CLASS, nodesToArray, tagValueArrToString } from './utils'

const MixInput = forwardRef((props: MixInputProps, ref: ForwardedRef<MixInputRef>) => {
  const { onChange, value, multiline, ...restProps } = props
  const contentRef = useRef(tagValueArrToString(value))
  const editorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!editorRef.current) return
    editorRef.current.innerHTML = tagValueArrToString(value)
  }, [value])

  const insertContent = (newContent: MixInputValue) => {
    const selection = window.getSelection()
    if (!selection) {
      return
    }

    const range = selection.getRangeAt(0)

    if (range.commonAncestorContainer !== editorRef.current && range.commonAncestorContainer.parentElement !== editorRef.current) {
      return
    }

    range.deleteContents()

    let node
    if (typeof newContent === 'string') {
      node = document.createTextNode(newContent)
      node.textContent = newContent
    } else if (typeof newContent === 'object' && newContent.type === 'tag') {
      node = document.createElement('span')
      node.classList.add(DEFAULT_TAG_CLASS)
      if (newContent.classes) {
        node.classList.add(newContent.classes)
      }
      node.setAttribute('contentEditable', 'false')
      node.innerHTML = newContent.label
    }

    if (!node) {
      console.error('invalid content')
      return
    }

    range.insertNode(node)
    const newRange = document.createRange()
    newRange.setStartAfter(node)
    newRange.setEndAfter(node)
    selection.removeAllRanges()
    selection.addRange(newRange)
    editorRef.current?.focus()

    contentRef.current = editorRef.current?.innerHTML ?? ''
    onChange?.(nodesToArray(editorRef.current?.childNodes))
  }

  useImperativeHandle(ref, () => ({
    inputRef: editorRef.current,
    insertContent,
    getValue: () => nodesToArray(editorRef.current?.childNodes),
  }))

  const handleContentChange = () => {
    if (editorRef.current) {
      contentRef.current = editorRef.current.innerHTML
    }
    onChange?.(nodesToArray(editorRef.current?.childNodes))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
    }
  }

  return (
    <div
      aria-label="input"
      role="textbox"
      tabIndex={0}
      className="mix-tag-input"
      contentEditable={true}
      ref={editorRef}
      onInput={handleContentChange}
      onKeyDown={handleKeyDown}
      dangerouslySetInnerHTML={{ __html: contentRef.current }}
      {...(multiline ? { 'aria-multiline': true } : {})}
      {...restProps}
    />
  )
})

export default MixInput
