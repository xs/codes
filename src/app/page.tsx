import { Flex, Link, Separator, Text } from "@radix-ui/themes";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Text size="3">
        <Flex gap="3">
          <Link href="/bezier">bezier mesh</Link>
          <Separator size="2" color="green" orientation="vertical" />
          <Link href="/slitscan">surface slitscan</Link>
          <Separator size="2" color="cyan" orientation="vertical" />
          <div className="blur-sm">city run</div>
        </Flex>
      </Text>
    </main>
  );
}
