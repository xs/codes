import { notFound } from "next/navigation";
import { Index, fetchPostIndex } from "@/utils/log";
import { Code } from "@radix-ui/themes";

export default async function Page({ params }: { params: { slug: string } }) {
  const postIndex: Index = await fetchPostIndex();
  console.log(postIndex);

  if (!(params.slug in postIndex)) {
    notFound();
  }

  return (
    <div>
      My Post: {params.slug}
      {Object.values(postIndex)[0].html}
      <Code>{postIndex[params.slug].markdown}</Code>
    </div>
  );
}

export async function generateStaticParams() {
  return [].map((file) => ({
    slug: file,
  }));
}
