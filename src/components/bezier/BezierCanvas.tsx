"use client";

import { CubicBezierLine, OrthographicCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { useState } from "react";
import { DoubleSide, Vector3 } from "three";

interface ControlPointProps {
  name: string;
  pos: Vector3;
  setPos: (pos: Vector3) => void;
  color: string;
  z: number;
}

function ControlPoint({
  name,
  pos,
  setPos,
  color,
  z,
}: ControlPointProps): JSX.Element {
  const [initialPos] = useState(pos.clone());
  const initX = initialPos.x;
  const initY = initialPos.y;

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const bind = useDrag(({ offset: [x, y] }) => {
    setPos(new Vector3(x / aspect + initX, -y / aspect + initY, pos.z));
  });

  const zOffset = new Vector3(0, 0, z);

  return (
    <mesh name={`dot-${name}`} position={pos.clone().add(zOffset)} {...bind()}>
      <circleGeometry args={[0.1]} />
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
  const [startPos, setStartPos] = useState<Vector3>(new Vector3(...start, 0));
  const [midAPos, setMidAPos] = useState<Vector3>(new Vector3(...midA, 0));
  const [midBPos, setMidBPos] = useState<Vector3>(new Vector3(...midB, 0));
  const [endPos, setEndPos] = useState<Vector3>(new Vector3(...end, 0));

  return (
    <>
      <ControlPoint
        name="a"
        pos={startPos}
        setPos={setStartPos}
        color="blue"
        z={-1}
      />
      <ControlPoint
        name="handleA"
        pos={midAPos}
        setPos={setMidAPos}
        color="magenta"
        z={-3}
      />
      <ControlPoint
        name="handleB"
        pos={midBPos}
        setPos={setMidBPos}
        color="red"
        z={-3}
      />
      <ControlPoint
        name="b"
        pos={endPos}
        setPos={setEndPos}
        color="green"
        z={-2}
      />
      <mesh name="curve" position={[0, 0, z]}>
        <CubicBezierLine
          start={startPos}
          midA={midAPos}
          midB={midBPos}
          end={endPos}
          color="black"
          lineWidth={1}
        />
      </mesh>
    </>
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
