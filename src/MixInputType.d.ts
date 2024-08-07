import '@total-typescript/ts-reset'

import type { CSSProperties, HTMLAttributes } from 'react'
export interface Tag {
  type: 'tag'
  attrs: {
    id?: string
    label?: string
    class?: string | string[]
    style?: CSSProperties
  }
}

export type MixInputValue = Tag | string

export type MixInputValues = MixInputValue[][]

export interface MixInputProps extends HTMLAttributes<HTMLDivElement> {
  value: MixInputValues
  placeholder?: string
  onChange: (value: MixInputValues) => void
  readonly?: boolean
  tagClassName?: string
  // multiline?: boolean
  // showTagDeleteBtn?: boolean
}

export interface MixInputRef {
  editor: HTMLDivElement | null
  insertContent: (content: MixInputValue | MixInputValue[]) => void
}
