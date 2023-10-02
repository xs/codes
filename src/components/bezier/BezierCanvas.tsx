"use client";

import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { DoubleSide } from "three";

export default function BezierCanvas(): JSX.Element {
  return (
    <>
      <Canvas>
        <OrthographicCamera
          makeDefault
          args={[-10, 10, 10, -10]}
          // annoyingly, near and far are reversed in orthographic camera
          zoom={40}
          position={[0, 0, 10]}
        >
          <mesh name="dot" position={[0, 0, -3]}>
            <circleGeometry args={[0.05]} />
            <meshBasicMaterial color="red" />
          </mesh>
          <mesh name="dot-ul" position={[-5, 5, -1]}>
            <circleGeometry args={[0.05]} />
            <meshBasicMaterial color="blue" />
          </mesh>
          <mesh name="dot-br" position={[5, -5, -2]}>
            <circleGeometry args={[0.05]} />
            <meshBasicMaterial color="green" />
          </mesh>
          <mesh name="rect" position={[0, 0, -10]}>
            <planeGeometry args={[10, 10]} />
            <meshBasicMaterial color="rgb(.9, .9, .9)" side={DoubleSide} />
          </mesh>

          <ambientLight />
        </OrthographicCamera>
      </Canvas>
    </>
  );
}
