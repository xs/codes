import { Box } from "@radix-ui/themes";

import BezierCanvas from "@/components/bezier/BezierCanvas";

// TODO: refactor BezierCanvas to use Canvas from @react-three/fiber
// so we don't need to wrap it in a Canvas component here
// and also remove the use client directive
export default async function Page() {
  return (
    <Box className="h-screen">
      <BezierCanvas />
    </Box>
  );
}
