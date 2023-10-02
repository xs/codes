"use client";

import { Box } from "@radix-ui/themes";
import { Canvas } from "@react-three/fiber";

import BezierCanvas from "@/components/bezier/BezierCanvas";

export default async function Page() {
  return (
    <Box className="h-screen">
      <Canvas>
        <BezierCanvas />
      </Canvas>
    </Box>
  );
}
