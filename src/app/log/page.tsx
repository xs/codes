import { Box } from "@radix-ui/themes";

import LogEntry from "@/components/LogEntry";
import { Post, PostIndex, fetchPostIndex } from "@/utils/log";

export default async function Page({ params }: { params: { slug: string } }) {
  const postIndex: PostIndex = await fetchPostIndex();
  console.log(postIndex);

  return (
    <Box>
      {Object.values(postIndex).map((post, index) => (
        <LogEntry post={post} />
      ))}
    </Box>
  );
}
