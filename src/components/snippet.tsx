import { Highlight, themes } from "prism-react-renderer";

const code = `import MixTagInput from "mix-tag-input";

const [value, setValue] = useState<MixInputValues>([
    [ "Text ", {type: "tag", attrs: {id: "1", label: "Tag"}} ]
  ]);

<MixTagInput value={value} onChange={handleChange} />`;

export default function Snippet() {
  return (
    <div className="w-11/12 grid overflow-hidden md:mt-20 mt-10">
      <div className="rounded-lg w-full text-left text-xs md:text-sm bg-slate-950  mx-auto overflow-auto">
        <Highlight theme={themes.nightOwl} language="tsx" code={code}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${className} pl-8 py-4`} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })} key={`line-${i}`}>
                  {line.map((token, key) => (
                    <span
                      {...getTokenProps({ token, key })}
                      key={`token-${key}`}
                    />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
