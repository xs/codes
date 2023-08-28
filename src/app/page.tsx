import { Code, Flex, Kbd, Separator } from "@radix-ui/themes";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Flex direction="column" className="text-xl font-bold items-center">
        <Code>xs.codes</Code>

        <Separator my="3" size="4" />

        <Kbd>⌘K</Kbd>
      </Flex>
    </main>
  );
}
