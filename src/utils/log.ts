import path from "path";
import fs from "fs";

export type Index = {
  [key: string]: string;
};

const logDir = path.join(process.cwd(), "src/log");

function allPosts(): Index {
  let slugs = fs
    .readdirSync(logDir)
    .map((filename) => path.basename(filename, ".md"));

  const index: Index = {};

  slugs.forEach((slug) => {
    const filePath = path.join(logDir, slug);
    const content = fs.readFileSync(filePath + ".md", "utf-8");
    index[slug] = content;
  });

  return index;
}

export const postIndex: Index = allPosts();
