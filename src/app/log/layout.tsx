import { Flex, Link, Section, Text } from "@radix-ui/themes";

import { PostIndex, fetchPostIndex } from "@/utils/log";

export default async function LogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const postIndex: PostIndex = await fetchPostIndex();

  return (
    <Flex className="overflow-hidden flex-col sm:flex-row flex-shrink-0 items-stretch w-screen h-screen">
      <Section className="order-2 sm:order-1 p-4 bg-gray-300 w-full sm:w-72">
        <ul className="list-disc list-inside">
          {Object.values(postIndex).map((post, index) => (
            <li key={post.id}>
              <Link href={`/log/${post.id}`}>{post.metadata.title}</Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section className="order-1 sm:order-2 p-4 bg-gray-200 flex-grow flex-shrink">
        {children}
      </Section>
    </Flex>
  );
}
