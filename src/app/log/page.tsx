import { Box } from "@radix-ui/themes";

import LogEntry from "@/app/log/LogEntry";
import { PostIndex, fetchPostIndex } from "@/utils/log";

export default async function Page() {
  const postIndex: PostIndex = await fetchPostIndex();

  return (
    <Box>
      {Object.values(postIndex).map((post) => (
        <LogEntry key={post.id} post={post} className="my-4" />
      ))}
    </Box>
  );
}
