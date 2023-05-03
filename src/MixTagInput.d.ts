import '@total-typescript/ts-reset'

import { RefObject } from 'react'

type Tag = {
  type: 'tag'
  label: string
  classes?: string
}

export type MixTagValue = string | Tag

export interface MixTagInputProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: MixTagValue[]
  multiline?: boolean
  onChange?: (value: MixTagValue[]) => void
}

export interface MixTagInputRef {
  inputRef: HTMLDivElement | null
  insertContent: (newContent: MixTagValue) => void
  getValue: () => MixTagValue[]
}
