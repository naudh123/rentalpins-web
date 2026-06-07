import type { BlogTocEntry } from "@/lib/blog-toc";
import { slugify } from "@/lib/seo";
import type { ComponentPropsWithoutRef } from "react";

const HEADING_SCROLL_CLASS = "scroll-mt-24";

function headingText(children: ComponentPropsWithoutRef<"h2">["children"]): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children
      .map((child) => (typeof child === "string" ? child : ""))
      .join("")
      .trim();
  }
  return "";
}

export function createBlogMdxComponents(toc: BlogTocEntry[]) {
  let index = 0;

  function nextId(level: 2 | 3, fallback: string): string {
    const entry = toc[index];
    if (entry?.level === level) {
      index += 1;
      return entry.id;
    }
    return slugify(fallback) || "section";
  }

  return {
    h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
      <h2
        id={nextId(2, headingText(children))}
        className={HEADING_SCROLL_CLASS}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
      <h3
        id={nextId(3, headingText(children))}
        className={HEADING_SCROLL_CLASS}
        {...props}
      >
        {children}
      </h3>
    ),
  };
}
