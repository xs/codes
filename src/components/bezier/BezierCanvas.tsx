"use client";

import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { useSearchParams } from "next/navigation";

export default function BezierCanvas(): JSX.Element {
  const searchParams = useSearchParams();
  const debug = searchParams.get("debug") !== null;
  return (
    <>
      <Leva
        hidden={!debug}
        hideCopyButton
        titleBar={{ filter: false }}
        oneLineLabels
      />
      <Canvas
        camera={{
          position: [0, 0, 0],
        }}
      >
        <ambientLight />
      </Canvas>
    </>
  );
}
