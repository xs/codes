"use client";

import {
  Blockquote,
  Container,
  Em,
  Heading,
  Link,
  Separator,
  Strong,
  Text,
} from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

import { Post } from "@/utils/log";

type Props = {
  post: Post;
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

export default function (props: Props) {
  return (
    <Container className="whitespace-normal">
      <ReactMarkdown
        children={props.post.markdown}
        remarkPlugins={[remarkFrontmatter, remarkGfm]}
        components={{
          a: ({ color, node, ...props }) => <Link {...props} />,
          blockquote: ({ color, node, ...props }) => <Blockquote {...props} />,
          // br - TODO: radix themes have no native support for this
          code: function ({ children, inline, node, ...props }) {
            if (inline) {
              return (
                <code className="bg-gray-100 text-gray-900 rounded-md px-1 py-0.5">
                  {children}
                </code>
              );
            } else {
              return (
                <SyntaxHighlighter
                  {...props}
                  PreTag="div"
                  language="ruby"
                  style={oneDark}
                  children={String(children)}
                />
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
          p: ({ color, node, ...props }) => <Text as="p" size="3" {...props} />,
          // pre - we ignore this because we use SyntaxHighlighter
          strong: ({ color, node, ...props }) => <Strong {...props} />,
          ul: ({ color, ordered, depth, node, ...props }) => (
            <ul
              className={`list-disc list-inside ${indent(depth)}`}
              {...props}
            />
          ),
        }}
      />
    </Container>
  );
}
