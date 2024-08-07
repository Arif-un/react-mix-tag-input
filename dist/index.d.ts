import React, { CSSProperties, HTMLAttributes } from 'react';

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
  // multiline?: boolean
  // showTagDeleteBtn?: boolean
}

interface MixInputRef {
  editor: HTMLDivElement | null
  insertContent: (content: MixInputValue | MixInputValue[]) => void
}

declare const MixInput: React.ForwardRefExoticComponent<MixInputProps & React.RefAttributes<MixInputRef>>;

export { type MixInputProps, type MixInputRef, type MixInputValue, type MixInputValues, type Tag, MixInput as default };
