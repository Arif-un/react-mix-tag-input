import { type NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import React from 'react'

export default function Tag(props: NodeViewProps) {
  const { tagView, tagClassName } = props.extension.options
  const { label, ...restAttrs } = props.node.attrs
  return (
    <>
      <NodeViewWrapper className={`mi-tag ${tagClassName || ''}`} data-type="tag" as="span">
        {tagView ? tagView(props) : <span {...restAttrs}>{label}</span>}
      </NodeViewWrapper>
      {'\u200B'}
    </>
  )
}
