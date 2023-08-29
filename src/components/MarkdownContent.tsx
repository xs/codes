"use client";

import { Heading, Link } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

type Props = {
  markdown: string;
};

export default function (props: Props) {
  return (
    <ReactMarkdown
      children={props.markdown}
      remarkPlugins={[remarkFrontmatter, remarkGfm]}
      components={{
        a: ({ href, title, ...props }) => <Link href={href} title={title} />,
        h1: ({ children, ...props }) => <Heading size="6">{children}</Heading>,
        h2: ({ children, ...props }) => <Heading size="5">{children}</Heading>,
        h3: ({ children, ...props }) => <Heading size="4">{children}</Heading>,
        h4: ({ children, ...props }) => <Heading size="3">{children}</Heading>,
        h5: ({ children, ...props }) => <Heading size="2">{children}</Heading>,
        h6: ({ children, ...props }) => <Heading size="1">{children}</Heading>,
        code: function ({ children, inline, ...props }) {
          return (
            <SyntaxHighlighter
              {...props}
              PreTag="div"
              language="ruby"
              style={oneDark}
              children={String(children)}
            />
          );
        },
      }}
    />
  );
}
