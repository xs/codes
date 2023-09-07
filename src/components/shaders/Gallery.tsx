"use client";

import Piece from "./Piece";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Shader } from "@/utils/shaders";

interface Props {
  shaders: Shader[];
}

// TODO: this scene should actually be called a Gallery; each individual mesh is a Piece
export default function Gallery({ shaders }: Props): JSX.Element {
  return (
    <Canvas className="cursor-move">
      <ambientLight />(
      {shaders.map((shader, index) => (
        <Piece
          key={shader.id}
          shader={shader}
          index={index}
          totalShaders={shaders.length}
        />
      ))}
      )
      <OrbitControls />
    </Canvas>
  );
}
