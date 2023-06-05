import '@total-typescript/ts-reset'

import type { HTMLAttributes } from 'react'

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
  type: 'tag'
  label: string
  classes?: string
  data?: any
  tagId?: string
}

type LineBreak = {
  type: 'line-break'
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
  insertContent: (newContent: MixInputValue | MixInputValue[]) => void
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

type MixInputValueNodeType = HTMLSpanElement | HTMLBRElement | Text | undefined
interface ArrayToHtmlNodeType {
  item: MixInputValue | MixInputValue[]
  componentId: string
  tagsDataRef: {
    current: any
  }
  showTagDeleteBtn: boolean
}
