"use client";

import { animated, useSpring } from "@react-spring/three";
import {
  CubicBezierLine,
  Line,
  OrthographicCamera,
  View,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { MutableRefObject, useRef, useState } from "react";
import { DoubleSide, Vector3 } from "three";

interface ControlPointProps {
  state: [Vector3, (pos: Vector3) => void];
  color: string;
  fixY?: boolean;
  fixX?: boolean;
}

const LOWER_BOUND: number = -10;
const UPPER_BOUND: number = 10;

function clamp(num: number): number {
  return Math.max(LOWER_BOUND, Math.min(num, UPPER_BOUND));
}

function ControlPoint({
  state,
  color,
  fixX,
  fixY,
}: ControlPointProps): JSX.Element {
  const [pos, setPos] = state;
  const [initialPos] = useState(pos.clone());
  const initX = initialPos.x;
  const initY = initialPos.y;

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const [spring, api] = useSpring(
    () => ({
      scale: 1,
      config: (key) => {
        switch (key) {
          case "scale":
            return {
              mass: 0.2,
              tension: 200,
              friction: 10,
            };
        }
      },
    }),
    [],
  );

  // TODO: rework this to figure out in-world pos at the start of the drag: https://use-gesture.netlify.app/docs/state/
  // switch to useGesture to do hover-like things
  const bind = useGesture({
    onDrag: ({ offset: [x, y] }) => {
      const newX = fixX ? initX : clamp(x / aspect + initX);
      const newY = fixY ? initY : clamp(-y / aspect + initY);
      setPos(new Vector3(newX, newY, pos.z));
    },
    onHover: ({ hovering }) => {
      if (typeof hovering === "boolean") {
        hovering ? api.start({ scale: 1.5 }) : api.start({ scale: 1 });
      }
    },
  });

  const zOffset = new Vector3(0, 0, -1 - Math.random() * 0.1);

  return (
    // @ts-ignore: bind() differs slightly from the type signature
    <animated.mesh
      scale={spring.scale}
      position={pos.clone().add(zOffset)}
      {...bind()}
    >
      <circleGeometry args={[0.1]} />
      <meshBasicMaterial color={color} />
    </animated.mesh>
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
      <mesh name="handleA" position={[0, 0, z]}>
        <Line
          points={[startPos, midAPos]}
          dashed={true}
          dashSize={0.1}
          gapSize={0.1}
          color="grey"
        />
      </mesh>
      <mesh name="handleB" position={[0, 0, z]}>
        <Line
          points={[midBPos, endPos]}
          dashed={true}
          dashSize={0.1}
          gapSize={0.1}
          color="grey"
        />
      </mesh>
      <ControlPoint fixX state={[startPos, setStartPos]} color="blue" />
      <ControlPoint state={[midAPos, setMidAPos]} color="magenta" />
      <ControlPoint state={[midBPos, setMidBPos]} color="red" />
      <ControlPoint fixX state={[endPos, setEndPos]} color="green" />
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

interface BezierControlProps {
  color: string;
  ref: MutableRefObject<HTMLElement | null>;
}

function BezierControl({ color, ref }: BezierControlProps): JSX.Element {
  return (
    <TrackedView track={ref}>
      <color attach="background" args={[color]} />
      <OrthographicCamera
        makeDefault
        args={[-10, 10, 10, -10]}
        // annoyingly, near and far are reversed in orthographic camera
        zoom={40}
        position={[0, 0, 10]}
      >
        <Curve
          start={[-10, 0]}
          midA={[-4, 9]}
          midB={[3, -8]}
          end={[10, 2]}
          z={-9}
        />

        <mesh name="rect" position={[0, 0, -10]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial color="rgb(.9, .9, .9)" side={DoubleSide} />
        </mesh>

        <ambientLight />
      </OrthographicCamera>
    </TrackedView>
  );
}

interface TrackedViewProps {
  children: React.ReactNode;
  track: MutableRefObject<HTMLElement | null>;
}

function TrackedView({ track, children }: TrackedViewProps): JSX.Element {
  return track && track.current ? (
    <View track={track as MutableRefObject<HTMLElement>} children={children} />
  ) : (
    <> {children} </>
  );
}
/*
 */

export default function BezierCanvas(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const bezierA = useRef<HTMLDivElement | null>(null);
  const bezierB = useRef<HTMLDivElement | null>(null);
  return (
    <div className="w-full h-full">
      <div ref={ref} className="flex flex-row w-full h-full bg-blue-200">
        <div className="flex-grow bg-purple-200"></div>
        <div className="flex flex-col w-1/3">
          <div ref={bezierA} className="flex-grow bg-orange-200"></div>
          <div ref={bezierB} className="flex-grow bg-pink-200"></div>
        </div>

        <Canvas
          eventSource={
            ref && ref.current
              ? (ref as MutableRefObject<HTMLElement>)
              : undefined
          }
        >
          <BezierControl ref={bezierA} color="lightblue" />
          <BezierControl ref={bezierB} color="lightgreen" />
        </Canvas>
      </div>
    </div>
  );
}
