import { Code } from "@radix-ui/themes";
import { notFound } from "next/navigation";

import { Index, Post, fetchPostIndex } from "@/utils/log";

export default async function Page({ params }: { params: { slug: string } }) {
  const postIndex: Index = await fetchPostIndex();
  console.log(postIndex);

  if (!(params.slug in postIndex)) {
    notFound();
  }

  const post: Post = postIndex[params.slug];

  return <div dangerouslySetInnerHTML={{ __html: post.html }} />;
}

export async function generateStaticParams() {
  return [].map((file) => ({
    slug: file,
  }));
}
