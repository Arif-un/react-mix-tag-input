import { ny } from "~/lib/utils";

export default function Table({
  rows,
  headers = ["Prop", "Description", "Default", "Type"],
}: {
  rows: any[];
  headers?: string[];
}) {
  return (
    <table className="bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 border-separate border-spacing-0 w-full">
      <thead className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-slate-500">
        <tr>
          {headers.map((header, index) => (
            <th
              key={`${index}-${header}`}
              className={ny([
                `px-3 py-2 text-left font-medium`,
                index === 0 && "rounded-tl-lg",
                index === headers.length - 1 && "rounded-tr-lg",
              ])}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="[&>tr:last-child>td:first-child]:rounded-bl-lg [&>tr:last-child>td]:border-b [&>tr:last-child>td:last-child]:rounded-br-lg ">
        {rows.map((item, index) => (
          <tr key={`${index}-${item.prop}`}>
            <td className="px-3 py-2 border font-mono text-xs text-slate-500 border-r-0 border-b-0">
              <code className="border rounded-md p-0.5 bg-slate-100 dark:bg-slate-800 dark:text-slate-400">
                {item.prop}
              </code>
            </td>
            <td className="border py-1 px-2 border-r-0 border-b-0">
              {item.description}
            </td>
            <td className="border py-1 px-2 border-r-0 border-b-0">
              {item.default}
            </td>
            <td className="border py-1 px-2 border-b-0 min-w-60">{item.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
