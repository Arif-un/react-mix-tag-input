import { useEffect, useState } from "react";
import { ny } from "~/lib/utils";

const links = [
  { title: "Installation", id: "installation" },
  {
    title: "Examples",
    id: "custom-styles",
    children: [
      {
        title: "Custom Styles",
        id: "custom-styles",
      },
      {
        title: "Custom Tag Component",
        id: "custom-tag-view",
      },
    ],
  },
  {
    title: "Props",
    id: "mix-tag-input",
    children: [
      {
        title: "MixTagInput",
        id: "mix-tag-input",
      },
      {
        title: "MixInputRef",
        id: "mix-input-ref",
      },
      {
        title: "MixInputValues",
        id: "mix-input-values",
      },
      {
        title: "Tag",
        id: "tag",
      },
    ],
  },
];

export default function TableOfContent({ className }: { className?: string }) {
  const [currentHash, setCurrentHash] = useState(
    typeof window !== "undefined" ? window.location.hash : ""
  );

  useEffect(() => {
    function handleScroll() {
      const sections = document.querySelectorAll("h2, h3, h4, h5, h6");
      let activeHash = "";
      sections.forEach((el) => {
        console.log(el.id, el.getBoundingClientRect().top);
        const top = el.getBoundingClientRect().top;
        if (top > 20 && top < 220) {
          activeHash = `#${el.id}`;
        }
      });

      if (activeHash) {
        setCurrentHash(activeHash);
        window.history.replaceState(null, "", activeHash);
      } else {
        setCurrentHash("");
        window.history.replaceState(null, "", "");
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={ny(["fixed hidden md:inline-block right-6 top-28 text-xs text-slate-400 font-light", className])}
    >
      <ul className="">
        {links.map((link) => (
          <li key={link.id} className="my-2">
            <a
              href={`#${link.id}`}
              className={ny([currentHash === `#${link.id}` && "text-blue-500 font-medium"])}
            >
              {link.title}
            </a>
            {link.children && (
              <ul className="ml-4">
                {link.children.map((child) => (
                  <li key={child.id} className="my-2">
                    <a
                      href={`#${child.id}`}
                      className={ny([
                        currentHash === `#${child.id}` && "text-blue-500 font-medium",
                      ])}
                    >
                      {child.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
