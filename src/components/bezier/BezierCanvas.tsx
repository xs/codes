"use client";

import { CubicBezierLine, OrthographicCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useState } from "react";
import { DoubleSide } from "three";

export default function BezierCanvas(): JSX.Element {
  const [offset, setOffset] = useState(0);

  useFrame(({ clock }) => {
    setOffset(-clock.getElapsedTime());
  });

  return (
    <>
      <OrthographicCamera
        makeDefault
        args={[-10, 10, 10, -10]}
        // annoyingly, near and far are reversed in orthographic camera
        zoom={40}
        position={[0, 0, 10]}
      >
        <mesh name="dot-ul" position={[-5, 5, -1]}>
          <circleGeometry args={[0.05]} />
          <meshBasicMaterial color="blue" />
        </mesh>
        <mesh name="dot" position={[-4, 5, -3]}>
          <circleGeometry args={[0.05]} />
          <meshBasicMaterial color="magenta" />
        </mesh>
        <mesh name="dot" position={[3, -5, -3]}>
          <circleGeometry args={[0.05]} />
          <meshBasicMaterial color="red" />
        </mesh>
        <mesh name="dot-br" position={[5, -5, -2]}>
          <circleGeometry args={[0.05]} />
          <meshBasicMaterial color="green" />
        </mesh>
        <mesh name="rect" position={[0, 0, -10]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial color="rgb(.9, .9, .9)" side={DoubleSide} />
        </mesh>

        <mesh name="curve" position={[0, 0, -9]}>
          <CubicBezierLine
            start={[-5, 5, 0]} // Starting point
            midA={[-4, 5, 0]} // First control point
            midB={[3, -5, 0]} // Second control point
            end={[5, -5, 0]} // Ending point
            color="black" // Default
            lineWidth={1} // In pixels (default)
            dashed={true} // Default
            dashSize={0.2} // In pixels (default)
            gapSize={0.1} // In pixels (default)
            dashOffset={offset}
          />
        </mesh>

        <ambientLight />
      </OrthographicCamera>
    </>
  );
}
