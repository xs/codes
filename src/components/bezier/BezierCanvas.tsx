"use client";

import { CubicBezierLine, OrthographicCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
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
  const initX = pos[0];
  const initY = pos[1];

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const bind = useDrag(({ offset: [x, y] }) => {
    setPosition(new Vector3(x / aspect + initX, -y / aspect + initY, z));
  });

  return (
    <mesh name={`dot-${name}`} position={position} {...bind()}>
      <circleGeometry args={[0.2]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

interface CurveProps {
  start: [number, number];
  midA: [number, number];
  midB: [number, number];
  end: [number, number];
  z: number;
}

function Curve({ start, midA, midB, end, z }: CurveProps): JSX.Element {
  return (
    <mesh name="curve" position={[0, 0, z]}>
      <CubicBezierLine
        start={[...start, 0]}
        midA={[...midA, 0]}
        midB={[...midB, 0]}
        end={[...end, 0]}
        color="black"
        lineWidth={1}
      />
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
        <Curve
          start={[-5, 5]}
          midA={[-4, 5]}
          midB={[3, -5]}
          end={[5, -5]}
          z={-9}
        />

        <mesh name="rect" position={[0, 0, -10]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial color="rgb(.9, .9, .9)" side={DoubleSide} />
        </mesh>

        <ambientLight />
      </OrthographicCamera>
    </Canvas>
  );
}
