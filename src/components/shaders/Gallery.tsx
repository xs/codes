"use client";

import Piece from "./Piece";
import WASDControls from "./WASDControls";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

import { Shader } from "@/utils/shaders";

interface Props {
  shaders: Shader[];
}

// TODO: make the gallery decide Piece positions and don't send totalShaders
export default function Gallery({ shaders }: Props): JSX.Element {
  return (
    <Canvas className="cursor-move">
      <WASDControls />
      <ambientLight />(
      <mesh position={[-4, 0, 2]}>
        <boxGeometry attach="geometry" args={[1, 1]} />
        <meshStandardMaterial attach="material" color="red" />
      </mesh>
      <mesh position={[0, 0, 10]}>
        <boxGeometry attach="geometry" args={[1, 1]} />
        <meshStandardMaterial attach="material" color="green" />
      </mesh>
      <mesh position={[4, 0, 2]}>
        <boxGeometry attach="geometry" args={[1, 1]} />
        <meshStandardMaterial attach="material" color="blue" />
      </mesh>
      {shaders.map((shader, index) => (
        <Piece
          key={shader.id}
          shader={shader}
          index={index}
          totalShaders={shaders.length}
        />
      ))}
      )
    </Canvas>
  );
}
