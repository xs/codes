import fs from "fs";
import path from "path";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { Processor, unified } from "unified";
import { matter } from "vfile-matter";

export type Post = {
  markdown: string;
  metadata: PostMetadata;
  id: string;
};

export type PostMetadata = {
  title?: string;
  date?: string;
};

export type PostIndex = {
  [key: string]: Post;
};

const logDir = path.join(process.cwd(), "src/log");

// write the .md file's frontmatter to file.data.matter
function handleFrontmatter() {
  return (_: Processor, file: any) => {
    matter(file);
  };
}

export async function fetchPostIndex(): Promise<PostIndex> {
  let slugs = fs
    .readdirSync(logDir)
    .map((filename) => path.basename(filename, ".md"));

  const index: PostIndex = {};

  slugs.forEach(async (slug) => {
    const filePath = path.join(logDir, slug);
    const markdown = fs.readFileSync(filePath + ".md", "utf-8");

    const file = await unified()
      .use(remarkParse)
      .use(remarkFrontmatter)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeStringify)
      .use(handleFrontmatter)
      .process(markdown);

    index[slug] = {
      markdown: markdown,
      metadata: file.data.matter || {},
      id: slug,
    };
  });

  return index;
}
