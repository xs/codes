"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

// See https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram for information
// on attributes and uniforms available to the vertex shader.
const defaultVertexShader = `
varying vec4 vPosition;


void main() {
  vPosition = vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vPosition;
}
`;

const defaultFragmentShader = `
uniform vec2 resolution;
varying vec4 vPosition;

void main() {
  gl_FragColor = vec4(.05, .13, .55, 1.0);
}
`;

const CubeMesh = () => {
  const mesh = useRef<Mesh>(null);

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[4, 6, 0.001]} />
      <shaderMaterial
        vertexShader={defaultVertexShader}
        fragmentShader={defaultFragmentShader}
        uniforms={{
          resolution: { value: [4, 6] },
        }}
      />
    </mesh>
  );
};

export default function Piece(): JSX.Element {
  return (
    <Canvas>
      <CubeMesh />
      <OrbitControls />
    </Canvas>
  );
}
