"use client";

import Piece from "./Piece";
import WASDControls, { wasdControlsDebugInfo } from "./WASDControls";
import { Canvas, useFrame } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { useSearchParams } from "next/navigation";
import { createContext, useContext, useRef, useState } from "react";
import { ACESFilmicToneMapping, Color, Mesh, Object3D, Vector3 } from "three";

import { Shader } from "@/utils/shaders";

interface Props {
  shaders: Shader[];
}

const BACKGROUND_COLOR = new Color(0xddd0ff);
const EXTRA_PIECES = 9;

type CameraPositionContextType = {
  cameraPosition: Vector3;
  setCameraPosition: (cameraPosition: Vector3) => void;
};

const defaultCameraPositionContext: CameraPositionContextType = {
  cameraPosition: new Vector3(),
  setCameraPosition: () => {},
};

export const CameraPositionContext = createContext<CameraPositionContextType>(
  defaultCameraPositionContext,
);

// TODO: make the gallery decide Piece positions and don't send totalShaders
function Pieces({ shaders }: Props): JSX.Element {
  const { cameraPosition } = useContext(CameraPositionContext);

  // keep track of all the meshes in the gallery
  const pieceMeshes = useRef<Record<number, Mesh | null>>({});
  pieceMeshes.current = {};

  const pieces: JSX.Element[] = [];

  const currentShaderIndex = Math.floor(cameraPosition.x / (3 * 8));
  const minShaderIndex = currentShaderIndex - EXTRA_PIECES;
  const maxShaderIndex = currentShaderIndex + EXTRA_PIECES;

  for (let index: number = minShaderIndex; index <= maxShaderIndex; index++) {
    const shaderIndex =
      ((index % shaders.length) + shaders.length) % shaders.length;
    const shader = shaders[shaderIndex];

    pieces.push(
      <Piece
        ref={(mesh) => (pieceMeshes.current[index] = mesh)}
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
  const [cameraPosition, setCameraPosition] = useState<Vector3>(new Vector3());

  const searchParams = useSearchParams();
  const debug = searchParams.get("debug") !== null;
  return (
    <CameraPositionContext.Provider
      value={{ cameraPosition, setCameraPosition }}
    >
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
        <fog attach="fog" args={[BACKGROUND_COLOR, 40, 180]} />
        <ambientLight />
        <Pieces shaders={shaders} />
        <WASDControls />
        {debug && (
          <mesh position={[0, -3 * 3, 0]}>
            <axesHelper args={[100]} />
          </mesh>
        )}
      </Canvas>
    </CameraPositionContext.Provider>
  );
}
