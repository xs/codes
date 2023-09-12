"use client";

import { useFrame } from "@react-three/fiber";
import { MutableRefObject, forwardRef, useRef } from "react";
import { Mesh, MeshPhongMaterial, Vector2, Vector3 } from "three";
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
  name: string;
  shader: Shader;
  index: number;
  totalShaders: number;
}

const HEIGHT_UNITS = 6;
const WIDTH_UNITS = 4;
const MARGIN_UNITS = 1;

const Piece = forwardRef<Mesh, Props>(function Piece(
  { name, shader, index, totalShaders }: Props,
  ref,
) {
  const width = WIDTH_UNITS / totalShaders;
  const height = HEIGHT_UNITS / totalShaders;
  const margin = MARGIN_UNITS / totalShaders;

  const uniforms = useRef<Uniforms>({
    u_time: { type: "f", value: 0.0 },
    u_resolution: { type: "v2", value: new Vector2(width, height) },
  });

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    uniforms.current.u_time.value = time;
  });

  const csmFragmentShader = shader.fragmentShader.replace(
    "gl_FragColor",
    "csm_FragColor",
  );

  // center the gallery
  const position = new Vector3(
    (index - (totalShaders - 1) / 2) * (width + margin),
    0,
    0,
  );
  const lightPos = new Vector3(0, 0, width);

  return (
    <mesh ref={ref} name={name} position={position}>
      <pointLight position={lightPos} intensity={2} />
      <boxGeometry args={[width, height, width / 10]} />
      <CustomShaderMaterial
        baseMaterial={MeshPhongMaterial}
        vertexShader={defaultVertexShader}
        fragmentShader={csmFragmentShader}
        shininess={1}
        reflectivity={2}
        uniforms={uniforms.current}
      />
    </mesh>
  );
});

export default Piece;
