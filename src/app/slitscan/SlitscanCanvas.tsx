"use client";

import { animated, useSpring } from "@react-spring/three";
import {
  CubicBezierLine,
  GizmoHelper,
  GizmoViewport,
  Line,
  OrbitControls,
  OrthographicCamera,
  View,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { Leva, useControls } from "leva";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import {
  Box3,
  BufferGeometry,
  Color,
  CubicBezierCurve3,
  DoubleSide,
  Vector3,
} from "three";

interface ControlPointProps {
  state: [Vector3, (pos: Vector3) => void];
  color: string | number;
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

  const bind = useGesture(
    {
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
    },
    {
      drag: {
        pointer: {
          touch: true,
        },
      },
      hover: {
        mouseOnly: false,
      },
    },
  );

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
      {/* red and blue for control points */}
      <ControlPoint fixX state={[start, setStart]} color={0xdc2626} />
      <ControlPoint state={[midA, setMidA]} color={0xf87171} />
      <ControlPoint state={[midB, setMidB]} color={0x60a5fa} />
      <ControlPoint fixX state={[end, setEnd]} color={0x2563eb} />
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

function BezierControl({ color, state }: BezierControlProps): JSX.Element {
  const { size } = useThree();

  const [cubic, setCubic] = state;
  const paddedViewport = UPPER_BOUND - LOWER_BOUND + 2 * MARGIN;

  return (
    <>
      <color attach="background" args={[color]} />
      <OrthographicCamera
        makeDefault
        args={[-10, 10, 10, -10]}
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

const RESOLUTION = 40;

interface AbstractMeshProps {
  points: Vector3[][];
  color: number;
  wireframe?: boolean;
}

function PointsMesh({ points, color }: AbstractMeshProps): JSX.Element {
  return (
    <>
      {points.map((curve, curveIndex) =>
        curve.map((point, index) => (
          <mesh key={curveIndex * points.length + index} position={point}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color={color} />
          </mesh>
        )),
      )}
    </>
  );
}

function PolygonMesh({
  points,
  color,
  wireframe,
}: AbstractMeshProps): JSX.Element {
  // set indicies to be triangles based on the dimension of points
  const numRows = points.length;
  const numCols = points[0].length;
  const indices = [];

  for (let i = 0; i < numRows - 1; i++) {
    for (let j = 0; j < numCols - 1; j++) {
      // for every square of points in the grid, we add two triangles as follows:
      // a - b
      // | / |
      // c - d
      const a = i * numCols + j;
      const b = i * numCols + j + 1;
      const c = (i + 1) * numCols + j;
      const d = (i + 1) * numCols + j + 1;
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  // set geometry from vertices
  const geometry = new BufferGeometry().setFromPoints(points.flat());

  // use indexed buffer geometry to reuse vertices
  geometry.setIndex(indices);

  // compute normals for lighting
  geometry.computeVertexNormals();

  return (
    <>
      <mesh>
        <bufferGeometry attach="geometry" {...geometry} />
        <meshPhongMaterial
          wireframe={wireframe}
          color={color}
          side={DoubleSide}
        />
      </mesh>
    </>
  );
}

interface BezierMeshProps {
  cubicA: Cubic;
  cubicB: Cubic;
  aspect: number;
}

function BezierMesh({ cubicA, cubicB, aspect }: BezierMeshProps): JSX.Element {
  const [debug, setDebug] = useControls("mesh", () => ({
    rotate: true,
    color: {
      r: 255 * Math.random(),
      g: 255 * Math.random(),
      b: 255 * Math.random(),
    },
    polygon: true,
    wireframe: { value: true, render: (get) => get("mesh.polygon") },
    light: {
      value: 500,
      min: 50,
      max: 1000,
      step: 50,
      render: (get) => get("mesh.polygon") && !get("mesh.wireframe"),
    },
  }));

  // add a keyboard listener to toggle rotation
  useEffect(() => {
    function onKeyUp(event: KeyboardEvent) {
      if (event.key === " ") {
        setDebug({ rotate: !debug.rotate });
      }
    }

    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [debug.rotate]);

  const lerpCubics = [];
  for (let i = 0; i <= RESOLUTION; i++) {
    const t = i / RESOLUTION;
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

  const height = 20 / aspect;

  const points = lerpCurves.map((curve, curveIndex) =>
    curve
      .getPoints(RESOLUTION)
      .map((point) =>
        point.add(
          new Vector3(
            0,
            0,
            (curveIndex - RESOLUTION / 2) / (RESOLUTION / height),
          ),
        ),
      ),
  );

  const color = debug.color.r * 256 ** 2 + debug.color.g * 256 + debug.color.b;

  return (
    <>
      {debug.polygon ? (
        <PolygonMesh
          wireframe={debug.wireframe}
          color={color}
          points={points}
        />
      ) : (
        <PointsMesh color={color} points={points} />
      )}
      <ambientLight intensity={2} color={0xffffff} />
      <PointLightCube radius={20} intensity={debug.light} />
      <OrbitControls makeDefault />
    </>
  );
}

interface PointLightCubeProps {
  radius: number;
  intensity: number;
}

function PointLightCube({
  radius,
  intensity,
}: PointLightCubeProps): JSX.Element {
  const coords = [-radius, 0, radius];

  // we place nine lights in a 3x3 grid above the origin and one light below the origin
  return (
    <>
      {coords.map((x) =>
        coords.map((z) => (
          <pointLight
            key={`x-${x}-z-${z}`}
            position={[x, radius, z]}
            intensity={intensity}
          />
        )),
      )}
      <pointLight position={[0, -radius, 0]} intensity={intensity / 2} />
    </>
  );
}

function rand10(): number {
  return Math.random() * 20 - 10;
}

function randCubic(): Cubic {
  return {
    start: new Vector3(-10, rand10(), 0),
    midA: new Vector3(rand10(), rand10(), 0),
    midB: new Vector3(rand10(), rand10(), 0),
    end: new Vector3(10, rand10(), 0),
  };
}

interface FramePlaneProps {
  aspect: number;
}

function FramePlane({ aspect }: FramePlaneProps): JSX.Element {
  const [plane] = useControls("plane", () => ({
    show: true,
    position: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
      render: (get) => get("plane.show"),
    },
    opacity: {
      value: 0.9,
      min: 0,
      max: 1,
      step: 0.01,
    },
    number: {
      value: 1,
      min: 1,
      max: 10,
      step: 1,
      render: (get) => get("plane.show"),
    },
    spacing: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
      render: (get) => get("plane.show") && get("plane.number") > 1,
    },
  }));

  const positions = [];

  // if number is 1, then spacing is irrelevant and position is the only thing that matters; 0 means a y position of -10, 1 means a y position of 10
  // if number > 1, then:
  //   - spacing of 0 means planes are in the same place
  // if number > 1, then spacing of 1 means planes are as far apart as possible, and position is irrelevant
  // if number > 1, then spacing of 0.5 means planes are spaced at a distance half of if it were 1, and position moves the entire set of planes
  for (let i = 0; i < plane.number; i++) {
    let yPosition;
    if (plane.number === 1) {
      yPosition = plane.position * 20 - 10;
    } else {
      let maxSpacing = 20 / (plane.number - 1);
      let spacing = maxSpacing * plane.spacing;
      let maxOffset = 20 - spacing * (plane.number - 1);
      let offset = maxOffset * plane.position;
      yPosition = -10 + i * spacing + offset;
    }
    positions.push(new Vector3(0, yPosition, 0));
  }

  return (
    <>
      {plane.show &&
        positions.map((position, index) => (
          <mesh key={index} position={position} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[20, 20 / aspect]} />
            <meshBasicMaterial
              transparent
              opacity={plane.opacity}
              color={0xffffff}
              side={DoubleSide}
            />
          </mesh>
        ))}
    </>
  );
}

interface SlitscanProps {
  cubicA: Cubic;
  cubicB: Cubic;
}

function Slitscan({ cubicA, cubicB }: SlitscanProps): JSX.Element {
  // add leva controls in the "slitscan" folder
  const [slitscan] = useControls("slitscan", () => ({
    aspect: {
      value: 4 / 3,
      options: {
        "16:9": 16 / 9,
        "4:3": 4 / 3,
        "1:1": 1,
        "3:4": 3 / 4,
        "9:16": 9 / 16,
      },
    },
  }));

  // add leva controls in the "helper" folder
  const [helpers] = useControls("helpers", () => ({
    axes: true,
    "bounding box": true,
  }));
  console.table({ cubicA, cubicB, slitscan, helpers });

  return (
    <>
      {helpers.axes && <axesHelper args={[12]} />}
      {helpers["bounding box"] && (
        <box3Helper
          args={[
            new Box3(
              new Vector3(-10, -10, -10 / slitscan.aspect),
              new Vector3(10, 10, 10 / slitscan.aspect),
            ),
            new Color("black"),
          ]}
        />
      )}
      <BezierMesh cubicA={cubicA} cubicB={cubicB} aspect={slitscan.aspect} />
      <FramePlane aspect={slitscan.aspect} />
    </>
  );
}

export default function SlitscanCanvas(): JSX.Element {
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
        {/* @ts-ignore: eventSource not worth dealing with */}
        <Canvas eventSource={eventSource} style={{ position: "absolute" }}>
          <View track={divMain as MutableRefObject<HTMLElement>}>
            <Slitscan cubicA={cubicA} cubicB={cubicB} />
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
