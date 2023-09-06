"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, MeshPhongMaterial, Vector3 } from "three";
import CustomShaderMaterial from "three-custom-shader-material";

import { Shader, Uniforms } from "@/utils/shaders";

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
  shader: Shader;
  index: number;
}

export default function Piece({ shader, index }: Props): JSX.Element {
  const mesh = useRef<Mesh>(null);

  const uniforms = useRef<Uniforms>({
    u_time: { value: 0 },
  });

  useFrame(({ clock }) => {
    if (!mesh.current) return;

    const time = clock.getElapsedTime();
    uniforms.current.u_time.value = time;
  });

  const csmFragmentShader = shader.fragmentShader.replace(
    "gl_FragColor",
    "csm_DiffuseColor",
  );

  const position = new Vector3(index * 6 - 3, 0, 0);
  const lightPos = new Vector3(0, 0, 2);

  return (
    <mesh ref={mesh} position={position}>
      <pointLight position={lightPos} intensity={3} />
      <boxGeometry args={[4, 6, 0.001]} />
      <CustomShaderMaterial
        baseMaterial={MeshPhongMaterial}
        vertexShader={defaultVertexShader}
        fragmentShader={csmFragmentShader}
        shininess={2}
        uniforms={uniforms.current}
      />
    </mesh>
  );
}
