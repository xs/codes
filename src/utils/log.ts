import fs from "fs";
import path from "path";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { Processor, VFileWithOutput, unified } from "unified";
import { matter } from "vfile-matter";

export type Post = {
  markdown: string;
  metadata: PostMetadata;
  id: string;
};

export type PostMetadata = {
  title?: string;
  date?: string;
  time?: string;
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

async function makePost(filename: string): Promise<Post> {
  const filePath = path.join(logDir, filename);
  const markdown = fs.readFileSync(filePath, "utf-8");

  const file = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(handleFrontmatter)
    .process(markdown);

  return {
    id: path.basename(filename, ".md"),
    markdown: markdown,
    metadata: file.data.matter || {},
  };
}

export async function fetchPostIndex(): Promise<PostIndex> {
  let logFilenames = fs.readdirSync(logDir);

  const index: PostIndex = {};

  await logFilenames.forEach(async (filename) => {
    const post = await makePost(filename);
    console.log("setting post id", post.id);
    index[post.id] = post;
  });

  console.log(index);

  return index;
}
