import './MixInput.css'

import React, {
  type FocusEvent,
  type FormEvent,
  type ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  type KeyboardEvent,
  MemoExoticComponent,
  RefAttributes,
  RefObject,
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
  normalizeJsonValue,
  removeZeroWidthSpace,
  setCaretPosition,
  split,
  stripHtml,
  tagValueArrToString,
} from './utils'
import { EditorContent, EditorContentProps, JSONContent, useEditor } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Mention from '@tiptap/extension-mention'
import Placeholder from '@tiptap/extension-placeholder'
import Tag from './Tag'
import TagExtension from './TagExtension'

type EditorRef = MemoExoticComponent<
  ForwardRefExoticComponent<Omit<EditorContentProps, 'ref'> & RefAttributes<HTMLDivElement>>
>
const MixInput = forwardRef(
  (props: MixInputType.MixInputProps, ref: ForwardedRef<MixInputType.MixInputRef>) => {
    const {
      onChange,
      value,
      // multiline,
      placeholder,
      showTagDeleteBtn = false,
      readonly = false,
      tagClassName = 'mtag',
      ...restProps
    } = props

    const componentId = useId()
    const editorRef = useRef<EditorRef>(null)

    const editor = useEditor({
      editorProps: { attributes: { class: 'mix-input' } },
      extensions: [
        Document,
        Paragraph.configure({
          HTMLAttributes: { class: 'mi-paragraph' },
        }),
        Text,
        Mention.configure({
          deleteTriggerWithBackspace: true,
          HTMLAttributes: { class: 'mi-mention' },
        }),
        Placeholder.configure({ placeholder: placeholder }),
        TagExtension,
      ],
      onUpdate: ({ editor }) => {
        console.log(
          '--',
          editor.getJSON().content,
          normalizeJsonValue(editor.getJSON().content).flat(),
        )
        onChange?.(normalizeJsonValue(editor?.getJSON()?.content || []))
      },
    })

    const insertContent = (content) => {
      editor?.chain().focus().insertContent(content).run()
    }

    useImperativeHandle(ref, () => ({
      element: editorRef.current,
      insertContent,
    }))

    const add = (type) => () => {
      if (type === 'mention') {
        editor
          ?.chain()
          .focus()
          .insertContent({
            type: 'mention',
            attrs: {
              id: '1',
              label: 'John Doe',
              sdfasdf: 'asdasd',
              'data-asd': 'wwww',
            },
          })
          .run()
      }
      if (type === 'tag') {
        editor
          ?.chain()
          .focus()
          .insertContent({
            type: 'tag',
            thisIsTag: true,
            attrs: {
              id: '111',
              sdfasdf: 'asdasd',
              label: 'Tag 1',
            },
          })
          .run()
      }
    }

    return (
      <>
        <button onClick={add('mention')}>add m</button>
        <button onClick={add('tag')}>add t</button>
        {/* <div key={`${componentId}-mix-input`} ref={editorRef} {...restProps} /> */}
        <EditorContent editor={editor} ref={editorRef} {...restProps} />
      </>
    )
  },
)

export default MixInput

// interface Text {
//   text: string
//   type: 'text'
// }

// interface Tag {
//   type: 'tag'
//   attrs: {
//     id: string
//     label: string
//   }
// }

// type EditorContentJson = (Text | Tag | { type: 'paragraph'; content: EditorContentJson })[]
