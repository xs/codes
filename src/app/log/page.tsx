import { Box, Separator } from "@radix-ui/themes";

import LogEntry from "@/components/LogEntry";
import { Post, PostIndex, fetchPostIndex } from "@/utils/log";

export default async function Page({ params }: { params: { slug: string } }) {
  const postIndex: PostIndex = await fetchPostIndex();

  return (
    <Box>
      {Object.values(postIndex).map((post, index) => (
        <LogEntry key={post.id} post={post} className="my-4" />
      ))}
    </Box>
  );
}
