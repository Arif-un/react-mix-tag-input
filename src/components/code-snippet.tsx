import { Highlight, themes } from "prism-react-renderer";
import PackageCopyButton from "./package-copy-button";
import { ny } from "~/lib/utils";

export default function CodeSnippet({
  code,
  language,
  className,
}: {
  code: string;
  language: string;
  className?: string;
}) {
  return (
    <div
      className={ny([
        "rounded-lg overflow-hidden text-left text-sm bg-slate-950 mx-auto relative",
        className,
      ])}
    >
      <Highlight theme={themes.nightOwl} language={language} code={code}>
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
  );
}
