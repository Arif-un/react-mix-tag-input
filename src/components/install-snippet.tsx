import { Highlight, themes } from "prism-react-renderer";
import PackageCopyButton from "./package-copy-button";

const code = `npm install @arif-un/react-mix-tag-input`;

export default function InstallSnippet() {
  return (
    <div className="mt-20 w-11/12 mx-auto">
      <h4 id="installation" className="text-left mb-2 scroll-mt-36">
        Installation
      </h4>
      <div className="rounded-lg text-xs overflow-auto text-left md:text-sm bg-slate-950 mx-auto relative">
        <PackageCopyButton
          packageName="@arif-un/react-mix-tag-input"
          className="absolute right-1 top-2"
        />
        <Highlight theme={themes.nightOwl} language="" code={code}>
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
