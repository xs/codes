"use client";

import Piece from "./Piece";
import WASDControls, { wasdControlsDebugInfo } from "./WASDControls";
import { Canvas, useFrame } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { useSearchParams } from "next/navigation";
import { MutableRefObject, useRef } from "react";
import { Mesh, Object3D } from "three";

import { Shader } from "@/utils/shaders";

interface GalleryProps {
  shaders: Shader[];
  debug: boolean;
}

interface GalleryCanvasProps {
  shaders: Shader[];
}

// TODO: make the gallery decide Piece positions and don't send totalShaders
function Gallery({ shaders, debug }: GalleryProps): JSX.Element {
  // keep track of all the meshes in the gallery
  const pieceMeshes = useRef<Record<string, Mesh | null>>({});

  const pieces = shaders.map((shader, index) => {
    const meshRef = useRef<Mesh>(null);
    pieceMeshes.current[shader.id] = meshRef.current;

    return (
      <Piece
        ref={meshRef}
        key={shader.id}
        name={shader.name}
        shader={shader}
        index={index}
        totalShaders={shaders.length}
      />
    );
  });

  // use the leva library to display any debug info
  const [, setDebug] = useControls(() => ({
    currentlyLookingAt: "nothing",
    ...wasdControlsDebugInfo,
  }));

  useFrame(({ raycaster }) => {
    // use raycasting to determine which piece is closest to the camera
    const objects = Object.values(pieceMeshes.current).filter(
      (mesh) => mesh !== null,
    ) as Object3D[];
    const intersections = raycaster.intersectObjects(objects);

    console.log("objects", objects);
    console.log("intersections", intersections);

    const currentlyLookingAt = intersections[0]?.object?.name ?? "nothing";
    setDebug({ currentlyLookingAt });
  });

  return (
    <>
      <WASDControls />
      <ambientLight />
      {debug && (
        <mesh position={[0, -3 / shaders.length, 0]}>
          <gridHelper args={[40, 40]} />
          <axesHelper args={[20]} />
        </mesh>
      )}
      {pieces}
    </>
  );
}

export default function GalleryCanvas({
  shaders,
}: GalleryCanvasProps): JSX.Element {
  const searchParams = useSearchParams();
  const debug = searchParams.get("debug") !== null;
  return (
    <>
      <Leva hidden={!debug} oneLineLabels />
      <Canvas>
        <Gallery shaders={shaders} debug={debug} />
      </Canvas>
    </>
  );
}
