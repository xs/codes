"use client";

import {
  Blockquote,
  Box,
  Container,
  Em,
  Heading,
  Link,
  Separator,
  Strong,
  Text,
} from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { solarizedDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

import { inconsolata } from "@/app/fonts";
import { Post } from "@/utils/log";

type Props = {
  post: Post;
  className?: string;
};

function indent(depth: number) {
  switch (depth) {
    case 0:
      return "indent-0";
    case 1:
      return "indent-4";
    case 2:
      return "indent-8";
    case 3:
      return "indent-12";
    case 4:
      return "indent-16";
    case 5:
      return "indent-20";
    case 6:
      return "indent-24";
    case 7:
      return "indent-28";
    case 8:
      return "indent-32";
    default:
      return "indent-36";
  }
}

const DEFAULT_CLASSES =
  "whitespace-normal border-gray-400 rounded-md border p-2 max-w-screen-md";

// TODO: tables
export default function LogEntry({ post, className }: Props) {
  // add whitespace-normal to the container
  const containerClassName = className
    ? `${className} ${DEFAULT_CLASSES}`
    : DEFAULT_CLASSES;
  return (
    <Container className={containerClassName}>
      <Box className="flex justify-between items-end">
        <Heading size="8" as="h1">
          {post.metadata.title}
        </Heading>
        <Text className="ml-2 pt-5 text-gray-500">{post.metadata.date}</Text>
      </Box>
      <Separator size="4" />
      <ReactMarkdown
        remarkPlugins={[remarkFrontmatter, remarkGfm]}
        components={{
          a: ({ color, node, ...props }) => <Link {...props} />,
          blockquote: ({ color, node, ...props }) => (
            <Blockquote my="2" {...props} />
          ),
          // br - TODO: radix themes have no native support for this
          code: ({ children, inline, node, className, ...props }) => {
            if (inline) {
              return (
                <code className="bg-gray-100 text-gray-900 rounded-md px-1 py-0.5">
                  {children}
                </code>
              );
            } else {
              const match = /language-(\w+)/.exec(className || "");
              let language = match ? match[1] : "text";
              return (
                <SyntaxHighlighter
                  {...props}
                  codeTagProps={{
                    className: `${inconsolata.className} rounded-md`,
                  }}
                  PreTag={(props: any) => (
                    <div className="rounded-md m-1" {...props} />
                  )}
                  language={language}
                  style={solarizedDark}
                  showLineNumbers
                >
                  {String(children)}
                </SyntaxHighlighter>
              );
            }
          },
          em: ({ node, ...props }) => <Em {...props} />,
          h1: ({ color, node, ...props }) => (
            <Heading size="6" as="h1" className="pt-4" {...props} />
          ),
          h2: ({ color, node, ...props }) => (
            <Heading size="5" as="h2" className="pt-3 pb-1" {...props} />
          ),
          h3: ({ color, node, ...props }) => (
            <Heading size="4" as="h3" className="pt-2 pb-1" {...props} />
          ),
          h4: ({ color, node, ...props }) => (
            <Heading size="3" as="h4" {...props} />
          ),
          h5: ({ color, node, ...props }) => (
            <Heading size="3" as="h5" {...props} />
          ),
          h6: ({ color, node, ...props }) => (
            <Heading size="3" as="h6" {...props} />
          ),
          hr: ({ color, node, ...props }) => <Separator size="4" {...props} />,
          // img
          // li - TODO: radix themes have no native support for this
          ol: ({ color, ordered, depth, node, ...props }) => (
            <ol
              className={`list-decimal list-inside ${indent(depth)}`}
              {...props}
            />
          ),
          p: ({ color, node, ...props }) => {
            return <Text as="p" {...props} />;
          },
          section: ({ color, className, node, ...props }) => {
            if (className === "footnotes") {
              className =
                "mt-4 [&_p]:inline [&_p]:text-xs [&_li]:text-xs [&_p]:text-gray-700";
            }
            return (
              <section className={className}>
                <Separator size="4" />
                {props.children}
              </section>
            );
          },
          // pre - we ignore this because we use SyntaxHighlighter
          strong: ({ color, node, ...props }) => <Strong {...props} />,
          ul: ({ color, ordered, depth, node, ...props }) => (
            <ul
              className={`list-disc list-inside ${indent(depth)}`}
              {...props}
            />
          ),
        }}
      >
        {post.markdown}
      </ReactMarkdown>
    </Container>
  );
}
