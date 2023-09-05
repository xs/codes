import { Em, Flex, Link, Separator, Text } from "@radix-ui/themes";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Text size="3">
        <Flex gap="3">
          <Link href="/log">log</Link>
          <Separator size="2" color="amber" orientation="vertical" />
          <Link href="/sketches">sketches</Link>
          <Separator size="2" color="cyan" orientation="vertical" />
          <div className="blur-sm">about</div>
        </Flex>
      </Text>
    </main>
  );
}
