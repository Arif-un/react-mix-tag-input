import './MixInput.css'

import React, { type ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

import { editorValueToMixInputValue, mixInputValueToEditorValue } from './utils'
import { EditorContent, useEditor } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Placeholder from '@tiptap/extension-placeholder'
import TagExtension from './TagExtension'
import { type MixInputProps, type MixInputRef, type MixInputValue } from './MixInputType'

const MixInput = forwardRef((props: MixInputProps, ref: ForwardedRef<MixInputRef>) => {
  const {
    onChange,
    value,
    // multiline,
    // showTagDeleteBtn = false,
    placeholder,
    readonly = false,
    tagClassName,
    editorOptions,
    ...restProps
  } = props

  const editorRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    editorProps: { attributes: { class: 'mix-input' } },
    extensions: [
      Document,
      Paragraph.configure({
        HTMLAttributes: { class: 'mi-paragraph' },
      }),
      Text,
      Placeholder.configure({ placeholder }),
      TagExtension.configure({
        tagClassName,
      }),
    ],
    onUpdate: ({ editor }) => {
      onChange?.(editorValueToMixInputValue(editor?.getJSON()?.content || []))
    },
    ...editorOptions,
  })

  const insertContent = (content: MixInputValue | MixInputValue[] | MixInputValue[][]) => {
    editor?.chain().focus().insertContent(content).run()
  }

  useEffect(() => {
    let updatedValueFromParent = mixInputValueToEditorValue(value)
    if (updatedValueFromParent.length === 0) {
      updatedValueFromParent = [{ type: 'paragraph' }]
    }
    if (JSON.stringify(updatedValueFromParent) === JSON.stringify(editor?.getJSON().content)) return

    editor?.commands.setContent(updatedValueFromParent)
  }, [value])

  useImperativeHandle(ref, () => ({
    element: editorRef.current,
    editor: editor,
    insertContent,
  }))

  return <EditorContent editor={editor} innerRef={editorRef} {...restProps} />
})

export default MixInput
