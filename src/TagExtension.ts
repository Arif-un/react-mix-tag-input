import { Attribute, mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import Tag from "./Tag";

export default Node.create({
  name: "tag",
  group: "inline",
  inline: true,
  atom: true,
  selectable: false,

  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`,
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Tag)
  },

  addAttributes() {
    const extraAttrs: Record<string, Attribute> = {}
    for (const key in this.options.attrs) {
      extraAttrs[key] = { default: this.options.attrs[key] }
    }
    return extraAttrs
  },
})
