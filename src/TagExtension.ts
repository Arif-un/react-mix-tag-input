import Tag from "./Tag";
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

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
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes)];
  },


  addNodeView: () => ({ node }) => {
    const span = document.createElement('span');
    span.className = 'mi-tag'
    span.innerHTML = node.attrs.label
    span.setAttribute('contenteditable', 'false');
    span.setAttribute('data-type', 'tag')
    span.setAttribute('data-id', node.attrs.id)

    return {
      dom: span,
    }
  },

  addAttributes() {
    return { label: undefined, id: undefined }
  }
});
