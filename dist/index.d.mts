import React, { HTMLAttributes } from 'react';

interface Tag {
  type: 'tag'
  label: string
  [key: string]: string
}

type LineBreak = {
  type: 'line-break'
}

type MixInputValue = string | Tag | LineBreak
type MixInputValues = MixInputValue[]

interface MixInputProps extends HTMLAttributes<HTMLDivElement> {
  value?: MixInputValues
  multiline?: boolean
  placeholder?: string
  onChange?: (value: MixInputValues) => void
  showTagDeleteBtn?: boolean
  readonly?: boolean
  tagClassName?: string
}

interface MixInputRef {
  element: HTMLDivElement | null
  caretPosition: number
  insertContent: (content: MixInputValue | MixInputValue[]) => void
}

declare const MixInput: React.ForwardRefExoticComponent<MixInputProps & React.RefAttributes<MixInputRef>>;

export { type MixInputProps, type MixInputRef, type MixInputValues, MixInput as default };
