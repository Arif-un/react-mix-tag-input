import { mergeAttributes, Node } from "@tiptap/core";

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


  addNodeView: () => ({ node, extension }) => {
    const span = document.createElement('span');
    span.className = 'mi-tag'
    span.innerHTML = node.attrs.label
    // span.setAttribute('contenteditable', 'false');
    span.setAttribute('data-type', 'tag')

    if (node.attrs.id) {
      span.setAttribute('data-id', node.attrs.id)
    }

    if (extension.options.tagClassName) {
      span.classList.add(extension.options.tagClassName)
    }

    if (node.attrs.class) {
      if (Array.isArray(node.attrs.class)) {
        node.attrs.class.forEach((c) => {
          span.classList.add(c as string)
        })
      } else {
        span.classList.add(node.attrs.class)
      }
    }

    if (node.attrs.style) {
      Object.assign(span.style, node.attrs.style)
    }

    const dom = document.createElement('span')
    dom.appendChild(span)
    // add zero-width space to make caret visible to outside of tag
    dom.appendChild(document.createTextNode('\u200B'))

    return { dom }
  },

  addAttributes() {
    return { label: undefined, id: undefined, class: undefined, style: undefined };
  }
});
