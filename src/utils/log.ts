import { unified } from "unified";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import path from "path";
import fs from "fs";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkRehype from "remark-rehype";

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
    const html = await unified()
      .use(remarkParse)
      .use(remarkFrontmatter)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(remarkStringify)
      .process(markdown);

    index[slug] = {
      markdown: markdown,
      html: String(html),
    };
  });

  return index;
}
