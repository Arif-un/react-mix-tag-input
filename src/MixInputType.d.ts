import '@total-typescript/ts-reset'

import type { HTMLAttributes } from 'react'

type Tag = {
  type: 'tag'
  label: string
  classes?: string
}

export type MixInputValue = string | Tag

export interface MixInputProps extends HTMLAttributes<HTMLDivElement> {
  value?: MixInputValue[]
  multiline?: boolean
  onChange?: (value: MixInputValue[]) => void
}

export interface MixInputRef {
  inputRef: HTMLDivElement | null
  insertContent: (newContent: MixInputValue) => void
  getValue: () => MixInputValue[]
}
