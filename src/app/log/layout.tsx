import { Box, Flex, Link, Section } from "@radix-ui/themes";

import { PostIndex, fetchPostIndex } from "@/utils/log";

export default async function LogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const postIndex: PostIndex = await fetchPostIndex();

  return (
    <Flex
      gap="4"
      className="overflow-hidden flex-col sm:flex-row flex-shrink-0"
    >
      <Section className="order-2 sm:order-1 p-4 bg-gray-300 w-full sm:w-72">
        {Object.values(postIndex).map((post) => (
          <Box key={post.id}>
            <Link href={`/log/${post.id}`}>{post.metadata.title}</Link>
          </Box>
        ))}
      </Section>
      <Section className="order-1 sm:order-2 p-4 bg-gray-200 flex-grow flex-shrink">
        {children}
      </Section>
    </Flex>
  );
}
