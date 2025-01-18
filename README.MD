# React Mix Tag Input

A react input component that pairs text with tags, supports multiline entry, and provides customizable tag rendering.

### [Full Documentation](https://arif-un.github.io/react-mix-tag-input/#custom-tag-view)

<br/>
<br/>

![mix tag input example](https://github.com/Arif-un/react-mix-tag-input/blob/master/example%20gif%20mix-tag-input.gif?raw=true)

<br/>
<br/>

####  Installation

```
npm install @arif-un/react-mix-tag-input
```

```
import  MixTagInput  from  "mix-tag-input";

const  [value, setValue]  =  useState<MixInputValues>([
  [ "Text ",  {type:  "tag", attrs:  {id:  "1", label:  "Tag"}} ]
]);

<MixTagInput  value={value}  onChange={handleChange}  />
```

<br/><br/>

### Props

#### `<MixTagInput />`

| Prop | Description | Default | Type |
|------|-------------|---------|------|
| `ref` | React forwardRef with options of component | | [MixInputRef](#mixinputref-reactforwardref) |
| `value` | Values of Mix Input | [] | [MixInputValues](#mixinputvalues--string--tag) |
| `onChange` | Function to handle the change event | | (value: [MixInputValues](#mixinputvalues--string--tag)) => void |
| `disabled` | Boolean value to set the input as disabled | false | Boolean |
| `placeholder` | Placeholder text | | string |
| `immediatelyRender` | Boolean value to render the component immediately on mount. Useful for server side rendering | false | Boolean |
| `tagClassName` | Class name for tags | mi-tag | string |
| `editorOptions` | Options for the editor | {} | [Editor](https://tiptap.dev/docs/editor/api/editor) |
| `tagAttrs` | Allowed attributes for tags, that returns with tag value on change and also render as data-* attribute | | { [key: string]: string } |
| `tagView` | Custom tag view component | | React.FC<[TagViewProps](https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views/react#all-available-props)> |

<br/><br/>

### MixInputRef: React.forwardRef

```typescript
import { type MixInputRef } from '@arif-un/react-mix-tag-input';

const ref = useRef<MixInputRef>(null);

// ...
ref.current?.insertContent({ type: 'tag', attrs: { id: '1', label: 'Tag' } });
// ...

return <MixTagInput ref={ref} />;
```

| Prop | Description | Type |
|------|-------------|------|
| insertContent | Function to insert content in the editor current caret position, accepts Tag or Text alone or in array | (content: [Tag](#tag) \| string \| ([Tag](#tag) \| string)[]) => void |
| element | Returns the editor element | HTMLDivElement |
| editor | Returns the editor instance | [Editor](https://tiptap.dev/docs/editor/api/editor) |


<br/><br/>

### MixInputValues: (string | Tag)[][]

```typescript
const text =  'Any text string'

const tag:  Tag  =  {
 type:  'tag',
 attrs:  {
   id:  '1',
   label:  'Tag',
   className:  'tag-class',
   style:  {color:  'cyan'}
   [key:  string]:  string  // key and default value need to specify in 'tagAttrs' prop
  },
}

const firstLineValues:  MixInputValues  =  [[ text, tag ]]

return  <MixTagInput  value={firstLineValues}  />;
```

#### Tag
| Prop | Description | Type |
|------|-------------|------|
| type | Type of the tag | `'tag'` |
| attrs | Attributes of the tag | `object` |
| attrs.id | Unique identifier of the tag | `string` |
| attrs.label | Label of the tag | `string` |
| attrs.className | Class name of the tag | `string` |
| attrs.style | Style of the tag | `React.CSSProperties` |
| attrs.[key: string] | Any other attribute. Key and default value need to specify in tagAttrs prop in order to get back with tag value on change and also render as data-* attribute | `string` |



  