import { useRef, useState } from "react";
import MixInput, {
  type MixInputRef,
  type MixInputValues,
  type Tag,
} from "@arif-un/react-mix-tag-input";
import { FiPlus } from "react-icons/fi";
import { Button } from "./button";

export default function HeaderExample() {
  const mixInputRef = useRef<MixInputRef>(null);
  const [value, setValue] = useState<MixInputValues>([
    [
      "Text and",
      {
        type: "tag",
        attrs: {
          id: "1",
          label: "Tag",
        },
      },
      "together",
    ],
  ]);

  const handleChange = (value: MixInputValues) => {
    setValue(value);
  };

  const addTag = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const newTag: Tag = { type: "tag", attrs: { id, label: "New Tag" } };
    mixInputRef.current?.insertContent(newTag);
  };

  return (
    <div className="gap-3">
      <div className="flex justify-center gap-3">
        <div>
          <MixInput
            ref={mixInputRef}
            className="bg-white dark:bg-slate-900 dark:border-slate-700 rounded-md px-2 py-1 text-left text- leading-normal w-80 mx-auto border border-slate-300 hover:border-blue-500 dark:hover:border-blue-500 focus:border-blue-700 focus:ring-1 ring-blue-600 outline-none"
            tagClassName="bg-blue-600 inline-flex leading-none text-white py-1 px-2 text-sm mx-1  rounded-md"
            onChange={handleChange}
            value={value}
            placeholder="Write something..."
            immediatelyRender={false}
          />
        </div>

        <Button onClick={addTag} variant="outline" className="text-xs gap-1">
          <FiPlus size={16} />
          Add Tag
        </Button>
      </div>

      <ul className="text-xs text-slate-500 list-disc w-8/12 mx-auto mt-4">
        <li>Try place caret anywhere in text and add tag</li>
      </ul>
    </div>
  );
}
