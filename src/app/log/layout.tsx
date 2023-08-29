import { Box, Flex, Link, Section } from "@radix-ui/themes";

import { PostIndex, fetchPostIndex } from "@/utils/log";

export default async function LogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const postIndex: PostIndex = await fetchPostIndex();

  return (
    <Flex direction="row" gap="4" className="overflow-hidden">
      <Section>
        {Object.values(postIndex).map((post) => (
          <Box key={post.id}>
            <Link href={`/log/${post.id}`}>{post.metadata.title}</Link>
          </Box>
        ))}
      </Section>
      <Section grow="1">{children}</Section>
    </Flex>
  );
}
