import { type NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import React from 'react'

export default function Tag(props: NodeViewProps) {
  const { tagView, tagClassName } = props.extension.options
  const { label, className, ...restAttrs } = props.node.attrs
  return (
    <>
      <NodeViewWrapper data-type="tag" as="span">
        {tagView ? (
          tagView(props)
        ) : (
          <span className={`${tagClassName || ''} ${className || ''}`} {...restAttrs}>
            {label}
          </span>
        )}
      </NodeViewWrapper>
      {'\u200B'}
    </>
  )
}
