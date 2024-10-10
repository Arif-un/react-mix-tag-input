import '@total-typescript/ts-reset'
import { Editor } from '@tiptap/core'
import { EditorContentProps, UseEditorOptions, NodeViewProps } from '@tiptap/react'

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
export interface Tag {
  type: 'tag'
  attrs: {
    id?: string
    label?: string
    className?: string
    style?: CSSProperties
    [key: string]: string | CSSProperties | undefined
  }
}

export type MixInputValue = Tag | string

export type MixInputValues = MixInputValue[][]

export interface MixInputProps extends HTMLAttributes<HTMLDivElement>, Omit<EditorContentProps, 'editor'> {
  value: MixInputValues
  placeholder?: string
  onChange: (value: MixInputValues) => void
  readonly?: boolean
  tagClassName?: string
  editorOptions?: UseEditorOptions
  tagAttrs?: Record<string, string | undefined>
  tagView?: (props: NodeViewProps) => React.ReactNode
  ssr?: boolean
  // multiline?: boolean
  // showTagDeleteBtn?: boolean
}

export interface MixInputRef {
  element: HTMLDivElement | null
  editor: Editor | null
  insertContent: (content: MixInputValue | MixInputValue[]) => void
}
