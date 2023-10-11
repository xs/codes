import { Box } from "@radix-ui/themes";

import SlitscanCanvas from "@/app/slitscan/SlitscanCanvas";

export default async function Page() {
  return (
    <Box className="h-[calc(100dvh)]">
      <SlitscanCanvas />
    </Box>
  );
}
