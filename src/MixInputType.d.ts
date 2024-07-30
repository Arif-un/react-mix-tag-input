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
  label: string
  'data-id'?: string
  [key: string]: string
}

// type LineBreak = {
//   type: 'line-break'
// }

export type MixInputValue = string | Tag
export type MixInputValues = MixInputValue[]

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
  element: HTMLDivElement | null
  caretPosition: number
  insertContent: (content: MixInputValue | MixInputValue[]) => void
  //   setCaret: (offset: number) => void
}
