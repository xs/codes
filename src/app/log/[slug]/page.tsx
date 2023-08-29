import { Code, Heading, Link } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

import { Index, Post, fetchPostIndex } from "@/utils/log";

export default async function Page({ params }: { params: { slug: string } }) {
  const postIndex: Index = await fetchPostIndex();
  console.log(postIndex);

  if (!(params.slug in postIndex)) {
    notFound();
  }

  const post: Post = postIndex[params.slug];

  return (
    <ReactMarkdown
      children={post.markdown}
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
              PreTag="div"
              language="ruby"
              children={String(children)}
            />
          );
        },
      }}
    />
  );
}

export async function generateStaticParams() {
  return [].map((file) => ({
    slug: file,
  }));
}
