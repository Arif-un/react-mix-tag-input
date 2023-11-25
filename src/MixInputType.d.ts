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
  [key: string]: string
}

type LineBreak = {
  type: 'line-break'
}

export type MixInputValue = string | Tag | LineBreak
export type MixInputValues = MixInputValue[]

export interface MixInputProps extends HTMLAttributes<HTMLDivElement> {
  value?: MixInputValues
  multiline?: boolean
  placeholder?: string
  onChange?: (value: MixInputValues) => void
  showTagDeleteBtn?: boolean
  readonly?: boolean
  tagClassName?: string
}

export interface MixInputRef {
  element: HTMLDivElement | null
  caretPosition: number
  insertContent: (content: MixInputValue | MixInputValue[]) => void
}

// export interface MixInputRef {
//   inputRef: HTMLDivElement | null
//   insertContent: (newContent: MixInputValue | MixInputValue[]) => void
//   getValue: () => MixInputValue[]
//   caretPosition: number
//   setCaret: (offset: number) => void
// }

// interface CreateTagElementParams {
//   componentId: string
//   showTagDeleteBtn: boolean
//   tagsDataRef: {
//     current: any
//   }
//   data: Tag
// }

// type MixInputValueNodeType = HTMLSpanElement | HTMLBRElement | Text | undefined
// interface ArrayToHtmlNodesType {
//   items: MixInputValue | MixInputValue[]
//   componentId: string
//   tagsDataRef: {
//     current: unknown
//   }
//   showTagDeleteBtn: boolean
// }
