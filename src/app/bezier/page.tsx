import { Box } from "@radix-ui/themes";

import BezierCanvas from "@/components/bezier/BezierCanvas";

export default async function Page() {
  return (
    <Box className="h-screen">
      <BezierCanvas />
    </Box>
  );
}
