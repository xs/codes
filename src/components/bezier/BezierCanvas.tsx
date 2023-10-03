"use client";

import { CubicBezierLine, OrthographicCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useState } from "react";
import { DoubleSide, Vector3 } from "three";

interface ControlPointProps {
  name: string;
  pos: [number, number];
  color: string;
  z: number;
}

function ControlPoint({ name, pos, color, z }: ControlPointProps): JSX.Element {
  const [position, setPosition] = useState<Vector3>(new Vector3(...pos, z));

  return (
    <mesh name={`dot-${name}`} position={position}>
      <circleGeometry args={[0.05]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export default function BezierCanvas(): JSX.Element {
  // TODO: draggable: https://maxrohde.com/2019/10/19/creating-a-draggable-shape-with-react-three-fiber
  return (
    <Canvas>
      <OrthographicCamera
        makeDefault
        args={[-10, 10, 10, -10]}
        // annoyingly, near and far are reversed in orthographic camera
        zoom={40}
        position={[0, 0, 10]}
      >
        <ControlPoint name="a" pos={[-5, 5]} color="blue" z={-1} />
        <ControlPoint name="handleA" pos={[-4, 5]} color="magenta" z={-3} />
        <ControlPoint name="handleB" pos={[3, -5]} color="red" z={-3} />
        <ControlPoint name="b" pos={[5, -5]} color="green" z={-2} />

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
            gapSize={0.4} // In pixels (default)
          />
        </mesh>

        <ambientLight />
      </OrthographicCamera>
    </Canvas>
  );
}
