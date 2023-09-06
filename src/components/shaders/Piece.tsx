import { useRef } from "react";
import { Mesh, MeshPhongMaterial, Vector3 } from "three";
import CustomShaderMaterial from "three-custom-shader-material";

import { Shader } from "@/utils/shaders";

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

  // merge resolution uniform with user-defined uniforms
  const uniforms = {
    resolution: { value: [4, 6] },
    ...shader.uniforms,
  };

  const csmFragmentShader = shader.fragmentShader.replace(
    "gl_FragColor",
    "csm_DiffuseColor",
  );

  const position = new Vector3(index * 6, 0, 0);
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
        uniforms={uniforms}
      />
    </mesh>
  );
}
