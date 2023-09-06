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

interface Props {
  fragmentShader: string;
}

export default function Piece({ fragmentShader }: Props): JSX.Element {
  const mesh = useRef<Mesh>(null);

  const csmFragmentShader = fragmentShader?.replace(
    "gl_FragColor",
    "csm_DiffuseColor",
  );

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[0, 0, 2]} intensity={3} />
      <mesh ref={mesh}>
        <boxGeometry args={[4, 6, 0.001]} />
        <CustomShaderMaterial
          baseMaterial={MeshPhongMaterial}
          vertexShader={defaultVertexShader}
          fragmentShader={csmFragmentShader}
          shininess={2}
          uniforms={{
            resolution: { value: [4, 6] },
          }}
        />
      </mesh>
      <OrbitControls
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />
    </Canvas>
  );
}
