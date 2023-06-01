import '@total-typescript/ts-reset'

import type { HTMLAttributes } from 'react'

type Tag = {
  type: 'tag'
  label: string
  classes?: string
  data?: any
}

export type MixInputValue = string | Tag
type LineBreak = {
  type: MixInputValueTypes.LINE_BREAK
}

export type MixInputValue = string | Tag | LineBreak

export interface MixInputProps extends HTMLAttributes<HTMLDivElement> {
  value?: MixInputValue[]
  multiline?: boolean
  placeholder?: string
  onChange?: (value: MixInputValue[]) => void
  showTagDeleteBtn?: boolean
  readonly?: boolean
}

export interface MixInputRef {
  inputRef: HTMLDivElement | null
  insertContent: (newContent: MixInputValue) => void
  getValue: () => MixInputValue[]
}
