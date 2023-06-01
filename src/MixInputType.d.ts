import '@total-typescript/ts-reset'

import type { HTMLAttributes } from 'react'

import { MixInputValueTypes } from './MixInputType.d'

export interface TagValueArrToStringParams {
  valueArr: MixInputValue[] | undefined
  showTagDeleteBtn: boolean
  tagsDataRef: {
    current: Record<string, any>
  }
  componentId: string
}

export interface CreateTagParams {
  classes: string
  text: string
  id: string
  showTagDeleteBtn: boolean
}

export type Tag = {
  type: MixInputValueTypes.TAG
  label: string
  classes?: string
  data?: any
  tagId?: string
}

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

interface CreateTagElementParams {
  componentId: string
  showTagDeleteBtn: boolean
  tagsDataRef: {
    current: Record<string, any>
  }
  data: Tag
}
