import { notFound } from "next/navigation";

import MarkdownContent from "@/components/MarkdownContent";
import { Index, Post, fetchPostIndex } from "@/utils/log";

export default async function Page({ params }: { params: { slug: string } }) {
  const postIndex: Index = await fetchPostIndex();
  console.log(postIndex);

  if (!(params.slug in postIndex)) {
    notFound();
  }

  const post: Post = postIndex[params.slug];

  return <MarkdownContent markdown={post.markdown} />;
}

export async function generateStaticParams() {
  return [].map((file) => ({
    slug: file,
  }));
}
