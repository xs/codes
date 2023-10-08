"use client";

import { animated, useSpring } from "@react-spring/three";
import {
  CubicBezierLine,
  Line,
  OrbitControls,
  OrthographicCamera,
  View,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { Leva, useControls } from "leva";
import { MutableRefObject, useRef, useState } from "react";
import { CubicBezierCurve3, DoubleSide, Vector3 } from "three";

interface ControlPointProps {
  state: [Vector3, (pos: Vector3) => void];
  color: string;
  fixY?: boolean;
  fixX?: boolean;
}

const MARGIN = 5;
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
      <circleGeometry args={[0.2]} />
      <meshBasicMaterial color={color} />
    </animated.mesh>
  );
}

interface CurveProps {
  state: [Cubic, (curve: Cubic) => void];
  z: number;
}

function Curve({ state, z }: CurveProps): JSX.Element {
  const [cubic, setCubic] = state;

  const { start, midA, midB, end } = cubic;

  const setPoint = (point: keyof Cubic, pos: Vector3) => {
    setCubic({ ...cubic, [point]: pos });
  };

  const setStart = (pos: Vector3) => setPoint("start", pos);
  const setMidA = (pos: Vector3) => setPoint("midA", pos);
  const setMidB = (pos: Vector3) => setPoint("midB", pos);
  const setEnd = (pos: Vector3) => setPoint("end", pos);

  return (
    <>
      <mesh name="handleA" position={[0, 0, z]}>
        <Line
          points={[start, midA]}
          dashed={true}
          dashSize={0.1}
          gapSize={0.1}
          color="grey"
        />
      </mesh>
      <mesh name="handleB" position={[0, 0, z]}>
        <Line
          points={[midB, end]}
          dashed={true}
          dashSize={0.1}
          gapSize={0.1}
          color="grey"
        />
      </mesh>
      <ControlPoint fixX state={[start, setStart]} color="blue" />
      <ControlPoint state={[midA, setMidA]} color="magenta" />
      <ControlPoint state={[midB, setMidB]} color="red" />
      <ControlPoint fixX state={[end, setEnd]} color="green" />
      <mesh name="curve" position={[0, 0, z]}>
        <CubicBezierLine
          start={start}
          midA={midA}
          midB={midB}
          end={end}
          color="black"
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

interface BezierControlProps {
  color: string;
  state: [Cubic, (cubic: Cubic) => void];
}

function rand10(): number {
  return Math.random() * 20 - 10;
}

function BezierControl({ color, state }: BezierControlProps): JSX.Element {
  const { viewport, camera, size } = useThree();

  // use the leva library to display any debug info
  /*
  const [, setDebug] = useControls(() => ({
    "viewport width": viewport.width,
    "viewport height": viewport.height,
    "zoom": camera.zoom,
    "size width": size.width,
    "size height": size.height,
  }));

  useFrame(({ viewport, camera, size }) => {
    setDebug({
      "viewport width": viewport.width,
      "viewport height": viewport.height,
      "zoom": camera.zoom,
      "size width": size.width,
      "size height": size.height,
    });
  });
  */
  const [cubic, setCubic] = state;
  const paddedViewport = UPPER_BOUND - LOWER_BOUND + 2 * MARGIN;

  return (
    <>
      <color attach="background" args={[color]} />
      <OrthographicCamera
        makeDefault
        args={[-10, 10, 10, -10]}
        // annoyingly, near and far are reversed in orthographic camera
        zoom={Math.min(
          size.width / paddedViewport,
          size.height / paddedViewport,
        )}
        position={[0, 0, 10]}
      >
        <Curve state={[cubic, setCubic]} z={-9} />

        <mesh name="rect" position={[0, 0, -10]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial color="rgb(.9, .9, .9)" side={DoubleSide} />
        </mesh>

        <ambientLight />
      </OrthographicCamera>
    </>
  );
}

interface Cubic {
  start: Vector3;
  midA: Vector3;
  midB: Vector3;
  end: Vector3;
}

interface BezierMeshProps {
  cubicA: Cubic;
  cubicB: Cubic;
}

const RESOLUTION = 40;

function BezierMesh({ cubicA, cubicB }: BezierMeshProps): JSX.Element {
  const [debug, setDebug] = useControls(() => ({
    rotate: true,
    resolution: RESOLUTION,
  }));

  const lerpCubics = [];
  for (let i = 0; i <= debug.resolution; i++) {
    const t = i / debug.resolution;
    const lerpCubic = {
      start: cubicA.start.clone().lerp(cubicB.start, t),
      midA: cubicA.midA.clone().lerp(cubicB.midA, t),
      midB: cubicA.midB.clone().lerp(cubicB.midB, t),
      end: cubicA.end.clone().lerp(cubicB.end, t),
    };
    lerpCubics.push(lerpCubic);
  }

  const lerpCurves = lerpCubics.map((cubic) => {
    return new CubicBezierCurve3(
      cubic.start,
      cubic.midA,
      cubic.midB,
      cubic.end,
    );
  });

  useFrame(({ clock, camera }) => {
    if (!debug.rotate) {
      return;
    }
    const radius = 25;
    const speed = 0.4;
    const angle = clock.getElapsedTime() * speed;
    camera.position.x = radius * Math.cos(angle);
    camera.position.y = radius * Math.sin(angle);
    camera.position.z = radius * Math.sin(angle);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {lerpCurves.map((curve, curveIndex) =>
        curve.getPoints(debug.resolution).map((point, index) => (
          <mesh
            key={index}
            position={point.add(
              new Vector3(
                0,
                0,
                (curveIndex - debug.resolution / 2) / (debug.resolution / 20),
              ),
            )}
          >
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="black" />
          </mesh>
        )),
      )}

      <ambientLight />
      <pointLight position={[6, 2, -6]} />
      <OrbitControls enablePan />
    </>
  );
}

function randCubic(): Cubic {
  return {
    start: new Vector3(-10, rand10(), 0),
    midA: new Vector3(rand10(), rand10(), 0),
    midB: new Vector3(rand10(), rand10(), 0),
    end: new Vector3(10, rand10(), 0),
  };
}

export default function BezierCanvas(): JSX.Element {
  const eventSource = useRef<HTMLDivElement>(null);
  const divMain = useRef<HTMLDivElement | null>(null);
  const divA = useRef<HTMLDivElement | null>(null);
  const divB = useRef<HTMLDivElement | null>(null);

  const [cubicA, setCubicA] = useState<Cubic>(randCubic());
  const [cubicB, setCubicB] = useState<Cubic>(randCubic());

  return (
    <>
      <div
        ref={eventSource}
        className="w-full h-full flex landscape:flex-row portrait:flex-col select-none touch-none"
      >
        <div
          ref={divMain}
          className="landscape:w-2/3 landscape:h-full portrait:h-2/3 portrait:w-full"
        />
        <div className="flex landscape:flex-col portrait:flex-row flex-grow">
          <div
            ref={divA}
            className="landscape:w-full portrait:h-full flex-grow"
          />
          <div
            ref={divB}
            className="landscape:w-full portrait:h-full flex-grow"
          />
        </div>
        <Leva hideCopyButton titleBar={{ filter: false }} />
        {/* @ts-ignore */}

        <Canvas eventSource={eventSource} style={{ position: "absolute" }}>
          <View track={divMain as MutableRefObject<HTMLElement>}>
            <BezierMesh cubicA={cubicA} cubicB={cubicB} />
          </View>
          <View track={divA as MutableRefObject<HTMLElement>}>
            <BezierControl color="white" state={[cubicA, setCubicA]} />
          </View>
          <View track={divB as MutableRefObject<HTMLElement>}>
            <BezierControl color="white" state={[cubicB, setCubicB]} />
          </View>
        </Canvas>
      </div>
    </>
  );
}
