"use client";

import Piece from "./Piece";
import WASDControls from "./WASDControls";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { useSearchParams } from "next/navigation";

import { Shader } from "@/utils/shaders";

interface Props {
  shaders: Shader[];
}

// TODO: make the gallery decide Piece positions and don't send totalShaders
export default function Gallery({ shaders }: Props): JSX.Element {
  const searchParams = useSearchParams();
  const debug = searchParams.get("debug") !== null;

  return (
    <>
      <Leva hidden={!debug} oneLineLabels />
      <Canvas className="cursor-move">
        <WASDControls />
        <ambientLight />
        {debug && (
          <mesh position={[0, -3 / shaders.length, 0]}>
            <gridHelper args={[40, 40]} />
            <axesHelper args={[20]} />
          </mesh>
        )}
        {shaders.map((shader, index) => (
          <Piece
            key={shader.id}
            shader={shader}
            index={index}
            totalShaders={shaders.length}
          />
        ))}
      </Canvas>
    </>
  );
}
