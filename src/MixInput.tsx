import './MixInput.css'

import React, { type ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

import { editorValueToMixInputValue, mixInputValueToEditorValue } from './utils'
import { EditorContent, useEditor } from '@tiptap/react'
import Document from './extension-document'
import Paragraph from './extension-paragraph'
import Text from './extension-text'
import Placeholder from '@tiptap/extension-placeholder'
import Tag from './extension-tag'
import { type MixInputProps, type MixInputRef, type MixInputValue } from './MixInputType'

const DEFAULT_TAG_ATTRS = {
  id: undefined,
  label: 'undefined',
  className: undefined,
  style: undefined,
}

const MixInput = forwardRef((props: MixInputProps, ref?: ForwardedRef<MixInputRef>) => {
  const {
    onChange,
    value = [],
    placeholder,
    disabled = false,
    tagClassName = 'mi-tag',
    editorOptions,
    className,
    tagAttrs,
    tagView,
    immediatelyRender = true,
    ...restProps
  } = props

  const editorRef = useRef<HTMLDivElement>(null)
  const previousValueRef = useRef<string>('')

  const editor = useEditor({
    editable: !disabled,
    immediatelyRender,
    editorProps: {
      attributes: { class: `mix-input ${disabled ? 'mi-disabled' : ''} ${className || ''}` },
    },
    extensions: [
      Document,
      Paragraph.configure({
        HTMLAttributes: { class: 'mi-paragraph' },
      }),
      Text,
      Placeholder.configure({ placeholder }),
      Tag.configure({
        tagClassName,
        attrs: { ...DEFAULT_TAG_ATTRS, ...tagAttrs },
        tagView,
      }),

    ],
    onUpdate: ({ editor }) => {
      if (disabled) return
      onChange?.(editorValueToMixInputValue(editor?.getJSON()?.content || []))
    },
    ...editorOptions,
  })

  const insertContent = (content: MixInputValue | MixInputValue[] | MixInputValue[][]) => {
    if (disabled) return
    editor?.chain().focus().insertContent(content).run()
  }

  useEffect(() => {
    if (!editor) return

    let updatedValueFromParent = mixInputValueToEditorValue(value)
    if (updatedValueFromParent.length === 0) {
      updatedValueFromParent = [{ type: 'paragraph' }]
    }

    const currentValueStr = JSON.stringify(updatedValueFromParent)
    const editorContentStr = JSON.stringify(editor.getJSON().content)

    // Only update if content has actually changed
    if (currentValueStr !== editorContentStr && currentValueStr !== previousValueRef.current) {
      previousValueRef.current = currentValueStr

      // Use setTimeout to move the update out of React's rendering phase
      setTimeout(() => {
        if (editor && !editor.isDestroyed) {
          editor.commands.setContent(updatedValueFromParent)
        }
      }, 0)
    }
  }, [value, editor])

  useImperativeHandle(ref, () => ({
    element: editorRef.current,
    editor,
    insertContent,
  }))

  return (
    <EditorContent
      aria-disabled={disabled}
      editor={editor}
      innerRef={editorRef}
      {...(restProps as Omit<typeof restProps, 'ref'>)}
    />
  )
})

export default MixInput
