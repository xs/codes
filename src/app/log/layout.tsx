import {
  Flex,
  Heading,
  Link,
  Section,
  Separator,
  Text,
} from "@radix-ui/themes";

import { PostIndex, fetchPostIndex } from "@/utils/log";

export default async function LogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const postIndex: PostIndex = await fetchPostIndex();

  return (
    <Flex className="flex-col md:flex-row flex-shrink-0 items-stretch w-screen h-screen overflow-x-hidden">
      <Section className="order-2 md:order-1 p-4 bg-gray-200 w-full md:w-72 md:overflow-y-auto md:h-screen">
        <Heading>Entries</Heading>
        <Separator size="4" className="mb-4" />
        <ul className="list-disc list-inside">
          {Object.values(postIndex).map((post, index) => (
            <li key={post.id}>
              <Link href={`/log/${post.slug}`}>{post.metadata.title}</Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section className="order-1 md:order-2 p-4 bg-gray-100 flex-grow flex-shrink md:overflow-y-auto md:h-screen">
        {children}
      </Section>
    </Flex>
  );
}
