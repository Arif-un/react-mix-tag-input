import React, { HTMLAttributes } from 'react';

type Tag = {
  type: 'tag'
  label: string
  classes?: string
}

type MixInputValue = string | Tag

interface MixInputProps extends HTMLAttributes<HTMLDivElement> {
  value?: MixInputValue[]
  multiline?: boolean
  onChange?: (value: MixInputValue[]) => void
}

interface MixInputRef {
  inputRef: HTMLDivElement | null
  insertContent: (newContent: MixInputValue) => void
  getValue: () => MixInputValue[]
}

declare const MixInput: React.ForwardRefExoticComponent<MixInputProps & React.RefAttributes<MixInputRef>>;

export { MixInputProps, MixInputRef, MixInputValue, MixInput as default };
