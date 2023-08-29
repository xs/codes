import { Em, Flex, Kbd, Separator, Text } from "@radix-ui/themes";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Text size="3">
        <Flex gap="3">
          log <Separator size="2" color="amber" orientation="vertical" />
          sketches
        </Flex>
      </Text>
    </main>
  );
}
