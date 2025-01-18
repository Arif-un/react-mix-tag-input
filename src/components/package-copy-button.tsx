import { FiCopy, FiCheck } from "react-icons/fi";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useClipboard } from "~/hooks/use-clipboard";

const packageManagers = [
  { name: "npm", command: "npm install" },
  { name: "pnpm", command: "pnpm add" },
  { name: "yarn", command: "yarn add" },
  { name: "bun", command: "bun add" },
];

export default function PackageCopyButton({
  packageName,
  className,
}: {
  packageName: string;
  className: string;
}) {
  const { copied, copyToClipboard } = useClipboard();

  const handleCopy = async (command: string) => {
    await copyToClipboard(`${command} ${packageName}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <Button
          aria-label="Copy package manager command"
          variant="ghost"
          size="icon"
          className="flex items-center justify-center text-slate-400 hover:text-slate-50 hover:bg-transparent"
        >
          {copied ? (
            <FiCheck className="mr-2 h-4 w-4 text-green-400" />
          ) : (
            <FiCopy className="mr-2 h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-20">
        {packageManagers.map((pm) => (
          <DropdownMenuItem
            key={pm.name}
            onClick={() => handleCopy(pm.command)}
            className="cursor-pointer"
          >
            <span className="font-mono">{pm.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
