import { notFound } from "next/navigation";

import LogEntry from "@/components/LogEntry";
import { Post, PostIndex, fetchPostIndex } from "@/utils/log";

export default async function Page({ params }: { params: { slug: string } }) {
  const postIndex: PostIndex = await fetchPostIndex();

  if (!(params.slug in postIndex)) {
    notFound();
  }

  const post: Post = postIndex[params.slug];

  return <LogEntry post={post} />;
}

export async function generateStaticParams() {
  return [].map((file) => ({
    slug: file,
  }));
}
