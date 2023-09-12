"use client";

import Piece from "./Piece";
import WASDControls, { wasdControlsDebugInfo } from "./WASDControls";
import { Canvas, useFrame } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import { ACESFilmicToneMapping, Color, Mesh, Object3D } from "three";

import { Shader } from "@/utils/shaders";

interface Props {
  shaders: Shader[];
}

const BACKGROUND_COLOR = new Color(0xeeddff);
const EXTRA_PIECES = 9;

// TODO: make the gallery decide Piece positions and don't send totalShaders
function Pieces({ shaders }: Props): JSX.Element {
  // keep track of all the meshes in the gallery
  const pieceMeshes = useRef<Record<string, Mesh | null>>({});
  const pieces: JSX.Element[] = [];

  for (let index: number = -EXTRA_PIECES; index <= EXTRA_PIECES; index++) {
    const shaderIndex =
      ((index % shaders.length) + shaders.length) % shaders.length;
    const shader = shaders[shaderIndex];

    pieces.push(
      <Piece
        ref={(mesh) => (pieceMeshes.current[shader.id] = mesh)}
        key={index}
        name={shader.name}
        shader={shader}
        index={index}
      />,
    );
  }

  // use the leva library to display any debug info
  const [, setDebug] = useControls(() => ({
    "currently looking at": "nothing",
    ...wasdControlsDebugInfo,
  }));

  useFrame(({ raycaster }) => {
    // use raycasting to determine which piece is closest to the camera
    const objects = Object.values(pieceMeshes.current).filter(
      (mesh) => mesh !== null,
    ) as Object3D[];
    const intersections = raycaster.intersectObjects(objects);

    setDebug({
      "currently looking at": intersections[0]?.object?.name ?? "nothing",
    });
  });

  return <>{pieces}</>;
}

export default function Gallery({ shaders }: Props): JSX.Element {
  const searchParams = useSearchParams();
  const debug = searchParams.get("debug") !== null;
  return (
    <>
      <Leva
        hidden={!debug}
        hideCopyButton
        titleBar={{ filter: false }}
        oneLineLabels
      />
      <Canvas
        scene={{
          background: BACKGROUND_COLOR,
        }}
        camera={{
          position: [0, 0, 0],
        }}
        gl={{
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
      >
        <fog attach="fog" args={[BACKGROUND_COLOR, 20, 160]} />
        <ambientLight />
        <Pieces shaders={shaders} />
        <WASDControls />
        {debug && (
          <mesh position={[0, -3 * 3, 0]}>
            <gridHelper args={[200, 200]} />
            <axesHelper args={[100]} />
          </mesh>
        )}
      </Canvas>
    </>
  );
}
