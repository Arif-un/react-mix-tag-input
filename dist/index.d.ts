import React, { CSSProperties, HTMLAttributes } from 'react';
import { Editor } from '@tiptap/core';
import { EditorContentProps, UseEditorOptions } from '@tiptap/react';

interface Tag {
  type: 'tag'
  attrs: {
    id?: string
    label?: string
    class?: string | string[]
    style?: CSSProperties
    [key: string]: string | string[] | CSSProperties | undefined
  }
}

type MixInputValue = Tag | string

type MixInputValues = MixInputValue[][]

interface MixInputProps extends HTMLAttributes<HTMLDivElement>, Omit<EditorContentProps, 'editor'> {
  value: MixInputValues
  placeholder?: string
  onChange: (value: MixInputValues) => void
  readonly?: boolean
  tagClassName?: string
  editorOptions?: UseEditorOptions
  tagAttrs?: Record<string, string | undefined>
  // multiline?: boolean
  // showTagDeleteBtn?: boolean
}

interface MixInputRef {
  element: HTMLDivElement | null
  editor: Editor | null
  insertContent: (content: MixInputValue | MixInputValue[]) => void
}

declare const MixInput: React.ForwardRefExoticComponent<Omit<MixInputProps, "ref"> & React.RefAttributes<MixInputRef>>;

export { type MixInputProps, type MixInputRef, type MixInputValue, type MixInputValues, type Tag, MixInput as default };
