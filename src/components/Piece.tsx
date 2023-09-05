"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

// See https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram for information
// on attributes and uniforms available to the vertex shader.
const defaultVertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const defaultFragmentShader = `
void main() {
  gl_FragColor = vec4(.05, .13, .55, 1.0);
}
`;

const CubeMesh = () => {
  const mesh = useRef<Mesh>(null);

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[4, 6]} />
      <shaderMaterial
        vertexShader={defaultVertexShader}
        fragmentShader={defaultFragmentShader}
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
