import React, { CSSProperties, HTMLAttributes } from 'react';
import { Editor } from '@tiptap/core';
import { UseEditorOptions } from '@tiptap/react';

interface Tag {
  type: 'tag'
  attrs: {
    id?: string
    label?: string
    class?: string | string[]
    style?: CSSProperties
  }
}

type MixInputValue = Tag | string

type MixInputValues = MixInputValue[][]

interface MixInputProps extends HTMLAttributes<HTMLDivElement> {
  value: MixInputValues
  placeholder?: string
  onChange: (value: MixInputValues) => void
  readonly?: boolean
  tagClassName?: string
  editorOptions?: UseEditorOptions
  // multiline?: boolean
  // showTagDeleteBtn?: boolean
}

interface MixInputRef {
  element: HTMLDivElement | null
  editor: Editor | null
  insertContent: (content: MixInputValue | MixInputValue[]) => void
}

declare const MixInput: React.ForwardRefExoticComponent<MixInputProps & React.RefAttributes<MixInputRef>>;

export { type MixInputProps, type MixInputRef, type MixInputValue, type MixInputValues, type Tag, MixInput as default };
