import { Attribute, mergeAttributes, Node } from "@tiptap/core";

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
    const { label, id, class: classes, style, ...restAttrs } = node.attrs
    span.innerHTML = label
    span.setAttribute('data-type', 'tag')

    if (id) {
      span.setAttribute('data-id', id)
    }

    if (extension.options.tagClassName) {
      span.classList.add(extension.options.tagClassName)
    }

    if (classes) {
      if (Array.isArray(classes)) {
        classes.forEach((c) => {
          span.classList.add(c as string)
        })
      } else {
        span.classList.add(classes)
      }
    }

    if (style) {
      Object.assign(span.style, style)
    }

    if (Object.keys(restAttrs).length) {
      Object.keys(restAttrs).forEach((key) => {
        span.dataset[key] = restAttrs[key]
      })
    }

    // Add event listeners
    if (extension.options.eventHandlers) {
      Object.entries(extension.options.eventHandlers).forEach(([eventName, handler]) => {
        span.addEventListener(eventName, handler as EventListener)
      })
    }

    const dom = document.createElement('span')
    dom.appendChild(span)
    // add zero-width space to make caret visible to outside of tag
    dom.appendChild(document.createTextNode('\u200B'))

    return {
      dom,
      destroy: () => {
        if (extension.options.eventHandlers) {
          Object.entries(extension.options.eventHandlers).forEach(([eventName, handler]) => {
            span.removeEventListener(eventName, handler as EventListener)
          })
        }
      }
    }
  },

  addAttributes() {
    const extraAttrs: Record<string, Attribute> = {}
    for (const key in this.options.attrs) {
      extraAttrs[key] = { default: this.options.attrs[key] }
    }
    return extraAttrs
  }
});
