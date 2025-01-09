import React$1, { CSSProperties, HTMLAttributes } from 'react';
import { Editor, JSONContent } from '@tiptap/core';
export { Editor } from '@tiptap/core';
import { EditorContentProps, UseEditorOptions, NodeViewProps } from '@tiptap/react';

interface Tag {
  type: 'tag'
  attrs: {
    id?: string
    label?: string
    className?: string
    style?: CSSProperties
    [key: string]: string | CSSProperties | undefined
  }
}

type MixInputValue = Tag | string

type MixInputValues = MixInputValue[][]

interface MixInputProps extends HTMLAttributes<HTMLDivElement>, Omit<EditorContentProps, 'editor'> {
  value?: MixInputValues
  placeholder?: string
  onChange?: (value: MixInputValues) => void
  readonly?: boolean
  tagClassName?: string
  editorOptions?: UseEditorOptions
  tagAttrs?: Record<string, string | undefined>
  tagView?: (props: NodeViewProps) => React.ReactNode
  immediatelyRender?: boolean
  ref?: React.Ref<MixInputRef>
  // multiline?: boolean
}

interface MixInputRef {
  element: HTMLDivElement | null
  editor: Editor | null
  insertContent: (content: MixInputValue | MixInputValue[]) => void
}

declare const MixInput: React$1.ForwardRefExoticComponent<Omit<MixInputProps, "ref"> & React$1.RefAttributes<MixInputRef>>;

declare function editorValueToMixInputValue(value: JSONContent[]): MixInputValues;
declare function mixInputValueToEditorValue(mixInputValues: MixInputValue[] | MixInputValue[][]): JSONContent[];

export { type MixInputProps, type MixInputRef, type MixInputValue, type MixInputValues, type Tag, MixInput as default, editorValueToMixInputValue, mixInputValueToEditorValue };
