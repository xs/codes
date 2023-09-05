"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, MeshPhongMaterial } from "three";
import CustomShaderMaterial from "three-custom-shader-material";

// See https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram for information
// on attributes and uniforms available to the vertex shader.
const defaultVertexShader = `
varying vec4 vPosition;


void main() {
  vPosition = vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vPosition;
}
`;

// need to declare csm_FragColor as a vec4 in the fragment shader because
// three-custom-shader-material expects this rather than gl_FragColor
const defaultFragmentShader = `
uniform vec2 resolution;
varying vec4 vPosition;

void main() {
  csm_DiffuseColor = vec4(.05, .13, .55, 1.0);
}
`;

const CubeMesh = () => {
  const mesh = useRef<Mesh>(null);

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[4, 6, 0.001]} />
      <CustomShaderMaterial
        baseMaterial={MeshPhongMaterial}
        vertexShader={defaultVertexShader}
        fragmentShader={defaultFragmentShader}
        shininess={2}
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
      <ambientLight />
      <pointLight position={[0, 0, 2]} intensity={1} />
      <pointLight position={[0, 0, -1]} intensity={0.5} />
      <CubeMesh />
      <OrbitControls />
    </Canvas>
  );
}
