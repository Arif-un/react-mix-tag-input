import CodeSnippet from "./code-snippet";
import SectionLink from "./SectionLink";
import Table from "./table";

const propsTableContent = [
  {
    prop: "ref",
    description: "React forwardRef with options of component",
    default: "",
    type: <SectionLink id="mix-input-ref">MixInputRef</SectionLink>,
  },
  {
    prop: "value",
    description: "Values of Mix Input",
    default: "[]",
    type: <SectionLink id="mix-input-values">MixInputValues</SectionLink>,
  },
  {
    prop: "onChange",
    description: "Function to handle the change event",
    default: "",
    type: (
      <>
        (value: <SectionLink id="mix-input-values">MixInputValues</SectionLink>){" "}
        {"=>"} void
      </>
    ),
  },
  {
    prop: "disabled",
    description: "Boolean value to set the input as disabled",
    default: "false",
    type: "Boolean",
  },
  {
    prop: "placeholder",
    description: "Placeholder text",
    default: "",
    type: "string",
  },
  {
    prop: "immediatelyRender",
    description:
      "Boolean value to render the component immediately on mount. Useful for server side rendering",
    default: "false",
    type: "Boolean",
  },
  {
    prop: "tagClassName",
    description: "Class name for tags",
    default: "mi-tag",
    type: "string",
  },
  {
    prop: "editorOptions",
    description: "Options for the editor",
    default: "{}",
    type: (
      <a
        rel="noreferrer noopener nofollow"
        className="text-blue-500 underline hover:text-blue-600"
        href="https://tiptap.dev/docs/editor/api/editor"
        target="_blank"
      >
        Editor
      </a>
    ),
  },
  {
    prop: "tagAttrs",
    description:
      "Allowed attributes for tags, that returns with tag value on change and also render as data-* attribute",
    default: "",
    type: "{ [key: string]: string }",
  },
  {
    prop: "tagView",
    description: "Custom tag view component",
    default: "",
    type: (
      <>
        React.FC{"<"}
        <a
          href="https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views/react#all-available-props"
          target="_blank"
          rel="noreferrer noopener nofollow"
          className="text-blue-500 underline hover:text-blue-600"
        >
          TagViewProps
        </a>
        {">"}
      </>
    ),
  },
];

const refTableContent = [
  {
    prop: "insertContent",
    description:
      "Function to insert content in the editor current caret position, accepts Tag or Text alone or in array",
    default: "",
    type: (
      <>
        (content: <SectionLink id="tag">Tag</SectionLink> | string | (
        <SectionLink id="tag">Tag</SectionLink> | string)[]) {"=>"} void
      </>
    ),
  },
  {
    prop: "element",
    description: "Returns the editor element",
    default: "",
    type: "HTMLDivElement",
  },
  {
    prop: "editor",
    description: "Returns the editor instance",
    default: "",
    type: (
      <a
        rel="noreferrer noopener nofollow"
        className="text-blue-500 underline hover:text-blue-600"
        href="https://tiptap.dev/docs/editor/api/editor"
        target="_blank"
      >
        Editor
      </a>
    ),
  },
];

const tagTableContent = [
  {
    prop: "type",
    description: "Type of the tag",
    default: "",
    type: <code>'tag'</code>,
  },
  {
    prop: "attrs",
    description: "Attributes of the tag",
    default: "",
    type: "object",
  },
  {
    prop: "attrs.id",
    description: "Unique identifier of the tag",
    default: "",
    type: "string",
  },
  {
    prop: "attrs.label",
    description: "Label of the tag",
    default: "",
    type: "string",
  },
  {
    prop: "attrs.className",
    description: "Class name of the tag",
    default: "",
    type: "string",
  },
  {
    prop: "attrs.style",
    description: "Style of the tag",
    default: "",
    type: "React.CSSProperties",
  },
  {
    prop: "attrs.[key: string]",
    description:
      "Any other attribute. Key and default value need to specify in tagAttrs prop in order to get back with tag value on change and also render as data-* attribute",
    default: "",
    type: "string",
  },
];

export default function PropsTable() {
  return (
    <>
      <div className="w-11/12 mt-28 mx-auto">
        <h4 className="text-xl font-medium mb-6 scroll-mt-36">Props</h4>
        <h5 id="mix-tag-input" className="mb-5">
          {"<MixTagInput />"}
        </h5>

        <Table rows={propsTableContent} />

        <h5 className="mt-28 mb-10 scroll-mt-36" id="mix-input-ref">
          MixInputRef: <span className="text-slate-500">React.forwardRef</span>
        </h5>

        <CodeSnippet
          className="mb-10"
          language="tsx"
          code={`import { type MixInputRef } from '@arif-un/react-mix-tag-input';
            
const ref = useRef<MixInputRef>(null);

// ...
ref.current?.insertContent({ type: 'tag', attrs: { id: '1', label: 'Tag' } });
// ...

return <MixTagInput ref={ref} />;`}
        />

        <Table rows={refTableContent} />

        <h5 className="mt-28 mb-10 scroll-mt-36" id="mix-input-values">
          MixInputValues:{" "}
          <span className="text-slate-500 font-mono">(string | Tag)[][]</span>
        </h5>

        <CodeSnippet
          className="mb-10"
          language="tsx"
          code={`const text = 'Any text string'

const tag: Tag = {
  type: 'tag',
  attrs: {
    id: '1',
    label: 'Tag',
    className: 'tag-class',
    style: {color: 'cyan'}
    [key: string]: string // key and default value need to specify in 'tagAttrs' prop
  },
}

const firstLineValues: MixInputValues = [[ text, tag ]]

return <MixTagInput value={firstLineValues} />;`}
        />

        <h5 className="my-5 scroll-mt-36" id="tag">
          Tag:
        </h5>
        <Table rows={tagTableContent} />
      </div>
    </>
  );
}
