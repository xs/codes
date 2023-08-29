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

export default function (props: Props) {
  return (
    <Container>
      <ReactMarkdown
        children={props.post.markdown}
        remarkPlugins={[remarkFrontmatter, remarkGfm]}
        components={{
          a: ({ color, ...props }) => <Link {...props} />,
          blockquote: ({ color, ...props }) => <Blockquote {...props} />,
          // br - TODO: radix themes have no native support for this
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
          em: ({ ...props }) => <Em {...props} />,
          h1: ({ color, ...props }) => <Heading size="6" {...props} />,
          h2: ({ color, ...props }) => <Heading size="5" as="h2" {...props} />,
          h3: ({ color, ...props }) => <Heading size="4" as="h3" {...props} />,
          h4: ({ color, ...props }) => <Heading size="3" as="h4" {...props} />,
          h5: ({ color, ...props }) => <Heading size="3" as="h5" {...props} />,
          h6: ({ color, ...props }) => <Heading size="3" as="h6" {...props} />,
          hr: ({ color, ...props }) => <Separator size="4" {...props} />,
          // img
          // li - TODO: radix themes have no native support for this
          ol: ({ color, ordered, depth, ...props }) => (
            <ol
              className={`list-decimal list-inside indent-${depth * 4}`}
              {...props}
            />
          ),
          p: ({ color, ...props }) => <Text size="3" {...props} />,
          // pre - we ignore this because we use SyntaxHighlighter
          strong: ({ color, ...props }) => <Strong {...props} />,
          ul: ({ color, ordered, depth, ...props }) => (
            <ul
              className={`list-disc list-inside indent-${depth * 4}`}
              {...props}
            />
          ),
        }}
      />
    </Container>
  );
}
