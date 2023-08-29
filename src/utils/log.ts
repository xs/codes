import fs from "fs";
import path from "path";
import rehypeSantize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export type Post = {
  markdown: string;
  html: string;
};

export type Index = {
  [key: string]: Post;
};

const logDir = path.join(process.cwd(), "src/log");

export async function fetchPostIndex(): Promise<Index> {
  let slugs = fs
    .readdirSync(logDir)
    .map((filename) => path.basename(filename, ".md"));

  const index: Index = {};

  slugs.forEach(async (slug) => {
    const filePath = path.join(logDir, slug);
    const markdown = fs.readFileSync(filePath + ".md", "utf-8");

    const file = await unified()
      .use(remarkParse)
      .use(remarkFrontmatter)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSantize)
      .use(rehypeStringify)
      .process(markdown);

    index[slug] = {
      markdown: markdown,
      html: String(file),
    };
  });

  return index;
}
