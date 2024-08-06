import { EditorContentProps } from '@tiptap/react'
import '@total-typescript/ts-reset'

import type { HTMLAttributes } from 'react'

export interface TagValueArrToStringParams {
  valueArr: MixInputValues | undefined
  showTagDeleteBtn?: boolean
  tagClassName?: string
}

export interface CreateTagParams {
  props: Tag
  showTagDeleteBtn: boolean
  tagClassName?: string
}

export interface Tag {
  type: 'tag'
  attrs: {
    id?: string
    label?: string
  }
}

// type LineBreak = {
//   type: 'line-break'
// }

export type MixInputValues = MixInputValue[][]

export interface MixInputProps extends HTMLAttributes<HTMLDivElement> {
  value: MixInputValues
  // multiline?: boolean
  placeholder?: string
  onChange: (value: MixInputValues) => void
  showTagDeleteBtn?: boolean
  readonly?: boolean
  tagClassName?: string
}

export interface MixInputRef {
  editor: EditorContentProps
  insertContent: (content: MixInputValue | MixInputValue[]) => void
  // caretPosition: number
  //   setCaret: (offset: number) => void
}
