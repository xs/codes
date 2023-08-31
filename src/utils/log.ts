import fs from "fs";
import path from "path";
import { read } from "to-vfile";
import { matter } from "vfile-matter";

export type Post = {
  markdown: string;
  metadata: PostMetadata;
  id: string;
  slug: string;
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

async function makePost(filename: string): Promise<Post> {
  const filePath = path.join(logDir, filename);
  const file = await read(filePath, "utf-8");
  matter(file, { strip: true });

  // set the id to the first three digits of the filename
  // e.g. 000-hello-world.md -> 000

  return {
    id: filename.slice(0, 3),
    slug: path.basename(filename, ".md"),
    markdown: String(file),
    metadata: file.data.matter || {},
  };
}

export async function fetchPostIndex(): Promise<PostIndex> {
  let logFilenames = fs.readdirSync(logDir);

  const index: PostIndex = {};

  for (const filename of logFilenames) {
    const post = await makePost(filename);
    index[post.slug] = post;
  }

  return index;
}
