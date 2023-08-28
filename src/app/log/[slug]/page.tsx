import { postIndex } from "@/utils/log";
import { Code } from "@radix-ui/themes";

export default function Page({ params }: { params: { slug: string } }) {
  if (!(params.slug in postIndex)) {
    console.log("notfound");
  }

  return (
    <div>
      My Post: {params.slug}
      {Object.values(postIndex)[0]}
      <Code>{postIndex[params.slug]}</Code>
    </div>
  );
}

export async function generateStaticParams() {
  return [].map((file) => ({
    slug: file,
  }));
}
