import MixInput from './MixInput'
import { editorValueToMixInputValue, mixInputValueToEditorValue } from './utils'
import type { MixInputProps, MixInputRef, MixInputValue, MixInputValues, Tag } from './MixInputType.d'
import { type Editor } from '@tiptap/core'
export default MixInput
export { editorValueToMixInputValue, mixInputValueToEditorValue }

export type {
  MixInputProps,
  MixInputRef,
  MixInputValue,
  MixInputValues,
  Tag,
  Editor
}
