import { Box, Flex, Section, Text } from "@radix-ui/themes";

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
            <Text size="3">{post.metadata.title}</Text>
          </Box>
        ))}
      </Section>
      <Section grow="1">{children}</Section>
    </Flex>
  );
}
