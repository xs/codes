"use client";

import Piece, { GALLERY_WIDTH } from "./Piece";
import WASDControls, { wasdControlsDebugInfo } from "./WASDControls";
import { Canvas, useFrame } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { useSearchParams } from "next/navigation";
import { createContext, useContext, useRef, useState } from "react";
import { ACESFilmicToneMapping, Color, Mesh, Object3D, Vector3 } from "three";

import ComposeContext from "@/utils/context";
import { Shader } from "@/utils/shaders";

interface Props {
  shaders: Shader[];
}

const EXTRA_PIECES = 9;

type CameraPositionContextType = {
  cameraPosition: Vector3;
  setCameraPosition: (cameraPosition: Vector3) => void;
};

export const CameraPositionContext = createContext<CameraPositionContextType>({
  cameraPosition: new Vector3(),
  setCameraPosition: () => {},
});

type BackgroundHueContextType = {
  backgroundHue: number;
  setBackgroundHue: (hue: number) => void;
};

export const BackgroundHueContext = createContext<BackgroundHueContextType>({
  backgroundHue: 250,
  setBackgroundHue: () => {},
});

function Pieces({ shaders }: Props): JSX.Element {
  const { cameraPosition } = useContext(CameraPositionContext);

  // keep track of all the meshes in the gallery
  const pieceMeshes = useRef<Record<number, Mesh | null>>({});

  // necessary reset when the shaders change
  pieceMeshes.current = {};

  const pieces: JSX.Element[] = [];

  const currentShaderIndex = Math.floor(cameraPosition.x / GALLERY_WIDTH);
  const minShaderIndex = currentShaderIndex - EXTRA_PIECES;
  const maxShaderIndex = currentShaderIndex + EXTRA_PIECES;

  for (let index: number = minShaderIndex; index <= maxShaderIndex; index++) {
    // wrap around the shaders array; the + shaders.length is to handle negative indices
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
  const [backgroundHue, setBackgroundHue] = useState(250);

  const searchParams = useSearchParams();
  const debug = searchParams.get("debug") !== null;
  return (
    <ComposeContext
      contexts={[
        {
          ContextProvider: BackgroundHueContext.Provider,
          value: { backgroundHue, setBackgroundHue },
        },
        {
          ContextProvider: CameraPositionContext.Provider,
          value: { cameraPosition, setCameraPosition },
        },
      ]}
    >
      <Leva
        hidden={!debug}
        hideCopyButton
        titleBar={{ filter: false }}
        oneLineLabels
      />
      <Canvas
        className="focus:animate-pulse"
        camera={{
          position: [0, 0, 0],
        }}
        gl={{
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
      >
        <color
          attach="background"
          args={[`hsl(${backgroundHue}, 100%, 95%)`]}
        />
        <fog
          attach="fog"
          args={[new Color(`hsl(${backgroundHue}, 100%, 95%)`), 40, 180]}
        />
        <ambientLight />
        <Pieces shaders={shaders} />
        <WASDControls />
        {debug && (
          <mesh position={[0, -3 * 3, 0]}>
            <axesHelper args={[100]} />
          </mesh>
        )}
      </Canvas>
    </ComposeContext>
  );
}
