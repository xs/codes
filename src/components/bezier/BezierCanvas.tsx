"use client";

import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { useSearchParams } from "next/navigation";
import { DoubleSide } from "three";

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
      <Canvas>
        <OrthographicCamera makeDefault position={[0, 0, 10]}>
          <mesh name="dot" position={[0, 0, 0.0001]}>
            <circleGeometry args={[0.05]} />
            <meshBasicMaterial color="red" />
          </mesh>

          <mesh name="rect">
            <planeGeometry args={[10, 10]} />
            <meshBasicMaterial color="rgb(.9, .9, .9)" side={DoubleSide} />
          </mesh>

          <OrbitControls />

          <ambientLight />
        </OrthographicCamera>
      </Canvas>
    </>
  );
}
