"use client";

import { useFrame } from "@react-three/fiber";
import { MutableRefObject, forwardRef, useRef, useState } from "react";
import {
  Color,
  DoubleSide,
  Euler,
  Mesh,
  MeshPhongMaterial,
  Vector2,
  Vector3,
} from "three";
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
}

const PIECE_WIDTH = 8;
const PIECE_HEIGHT = 12;

const CEILING_HEIGHT = 30;
export const GALLERY_WIDTH = 3 * PIECE_WIDTH;
export const HALLWAY_RADIUS = 20;
export const PIECE_THICKNESS = 0.1 * PIECE_WIDTH;
const LIGHT_DISTANCE = 4;
const WALL_COLOR = new Color(0xdddddd);

const Piece = forwardRef<Mesh, Props>(function Piece(
  { name, shader, index }: Props,
  ref,
) {
  const X_OFFSET = index * GALLERY_WIDTH;

  const [lightIntensity, setLightIntensity] = useState(50);

  const uniforms = useRef<Uniforms>({
    u_time: { type: "f", value: 0.0 },
    u_resolution: { type: "v2", value: new Vector2(PIECE_WIDTH, PIECE_HEIGHT) },
    u_index: { type: "i", value: index },
  });

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    uniforms.current.u_time.value = time;
    setLightIntensity(50 + 40 * Math.sin(time));
  });

  const csmFragmentShader = shader.fragmentShader.replace(
    "gl_FragColor",
    "csm_DiffuseColor",
  );

  // center the gallery

  const shaderPosition = new Vector3(0, 1.5, -HALLWAY_RADIUS);

  const lightPosition = new Vector3(0, 0, LIGHT_DISTANCE);

  // if index is even, rotate shader and light 180 degrees and place on other side of hallway
  if (index % 2 !== 0) {
    shaderPosition.applyAxisAngle(new Vector3(0, 1, 0), Math.PI);
    lightPosition.applyAxisAngle(new Vector3(0, 1, 0), Math.PI);
  }

  return (
    <group position={new Vector3(X_OFFSET, 0, 0)}>
      <mesh ref={ref} name={name} position={shaderPosition}>
        <pointLight position={lightPosition} intensity={lightIntensity} />
        <boxGeometry args={[PIECE_WIDTH, PIECE_HEIGHT, PIECE_THICKNESS * 2]} />
        <CustomShaderMaterial
          baseMaterial={MeshPhongMaterial}
          vertexShader={defaultVertexShader}
          fragmentShader={csmFragmentShader}
          shininess={50}
          reflectivity={2}
          uniforms={uniforms.current}
        />
      </mesh>

      <mesh
        name="art wall"
        position={new Vector3(0, 0.5 * PIECE_HEIGHT, -HALLWAY_RADIUS)}
      >
        <planeGeometry args={[3 * PIECE_WIDTH, CEILING_HEIGHT]} />
        <meshPhongMaterial color={WALL_COLOR} side={DoubleSide} />
      </mesh>

      <mesh
        name="ceiling"
        rotation={new Euler(Math.PI / 2, 0, 0, "XYZ")}
        position={new Vector3(0, 1.75 * PIECE_HEIGHT, 0)}
      >
        <planeGeometry args={[3 * PIECE_WIDTH, 2 * HALLWAY_RADIUS]} />
        <meshPhongMaterial color="white" side={DoubleSide} />
      </mesh>

      <mesh
        name="back wall"
        rotation={new Euler(0, Math.PI, 0, "XYZ")}
        position={new Vector3(0, 0.5 * PIECE_HEIGHT, HALLWAY_RADIUS)}
      >
        <planeGeometry args={[3 * PIECE_WIDTH, CEILING_HEIGHT]} />
        <meshPhongMaterial color={WALL_COLOR} side={DoubleSide} />
      </mesh>

      <mesh
        name="floor"
        rotation={new Euler(Math.PI / 2, 0, 0, "XYZ")}
        position={new Vector3(0, -0.75 * PIECE_HEIGHT, 0)}
      >
        <planeGeometry args={[3 * PIECE_WIDTH, 2 * HALLWAY_RADIUS]} />
        <meshPhongMaterial color="grey" side={DoubleSide} />
      </mesh>
    </group>
  );
});

export default Piece;
