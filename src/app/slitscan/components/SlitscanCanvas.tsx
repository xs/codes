"use client";

import { useAnimationFrame } from "../hooks/useAnimationFrame";
import { useVideo } from "../hooks/useVideo";
import { animated, useSpring } from "@react-spring/three";
import { Base, Geometry, Subtraction } from "@react-three/csg";
import {
  CubicBezierLine,
  Line,
  OrbitControls,
  OrthographicCamera,
  View,
  useVideoTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { Leva, useControls } from "leva";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box3,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  CubicBezierCurve3,
  DataTexture,
  DoubleSide,
  MeshBasicMaterial,
  Texture,
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

const RESOLUTION = 20;

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
  const geometry = meshGeometry(points, true);

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

// returns the points of a mesh between two cubic bezier curves
function meshPoints({ cubicA, cubicB, aspect }: BezierMeshProps): Vector3[][] {
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

  const height = 20 / aspect;

  return lerpCurves.map((curve, curveIndex) =>
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
}

// given a grid of points, returns a mesh geometry
function meshGeometry(points: Vector3[][], solid: Boolean): BufferGeometry {
  // set indicies to be triangles based on the dimension of points
  const numRows = points.length;
  const numCols = points[0].length;
  const indices = [];
  const uvs = [];

  for (let i = 0; i < numRows - 1; i++) {
    for (let j = 0; j < numCols - 1; j++) {
      uvs.push(i / (numRows - 1), j / (numCols - 1));
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

  const vertices = points.flat();

  // add vertices that project the first and last rows into the x-z plane at y = 10
  // then add indices to connect the vertices with triangles
  if (solid) {
    const firstRow = vertices.slice(0, numCols);
    const lastRow = vertices.slice(-numCols);
    const meshLength = vertices.length;

    const projectedFirstRow = firstRow.map(
      (v) => new Vector3(v.x * 1.001, 10, v.z * 1.001),
    );
    const projectedLastRow = lastRow.map(
      (v) => new Vector3(v.x * 1.001, 10, v.z * 1.001),
    );

    vertices.push(...projectedFirstRow, ...projectedLastRow);

    const firstRowIndices = firstRow.map((_, i) => i);
    const lastRowIndices = lastRow.map((_, i) => i + meshLength - numCols);

    const projectedFirstRowIndices = projectedFirstRow.map(
      (_, i) => meshLength + i,
    );
    const projectedLastRowIndices = projectedLastRow.map(
      (_, i) => numCols + i + meshLength,
    );

    for (let i = 0; i < numCols - 1; i++) {
      // the vertices are arranged as follows:
      //     a---------b
      //    /|        /|
      //   / |       / |
      //  e---------f  |
      //  |  |      |  |
      //  |  c------|--d
      //  | /       | /
      //  |/        |/
      //  g---------h
      // note that the c-d-g-h face is already drawn by the previous loop;
      // use the right-hand rule to determine the order of the vertices:
      // curl your fingers in vertex order, thumb points out of mesh
      const a = projectedFirstRowIndices[i];
      const b = projectedFirstRowIndices[i + 1];
      const c = firstRowIndices[i];
      const d = firstRowIndices[i + 1];
      const e = projectedLastRowIndices[i];
      const f = projectedLastRowIndices[i + 1];
      const g = lastRowIndices[i];
      const h = lastRowIndices[i + 1];
      indices.push(a, b, c, b, d, c);
      indices.push(e, g, f, f, g, h);
      indices.push(a, e, b, b, e, f);
    }

    // draw triangles to connect the first and last rows.
    // again, the vertices are arranged as follows:
    //     a---------b
    //    /|        /|
    //   / |       / |
    //  e---------f  |
    //  |  |      |  |
    //  |  c------|--d
    //  | /       | /
    //  |/        |/
    //  g---------h
    // but this time we draw the a-c-g-e and b-d-h-f faces
    const a = projectedFirstRowIndices[0];
    const b = projectedFirstRowIndices[numCols - 1];
    const c = firstRowIndices[0];
    const d = firstRowIndices[numCols - 1];
    const e = projectedLastRowIndices[0];
    const f = projectedLastRowIndices[numCols - 1];
    const g = lastRowIndices[0];
    const h = lastRowIndices[numCols - 1];

    indices.push(a, c, e, e, c, g, b, f, d, d, f, h);
  }

  // set geometry from vertices
  const geometry = new BufferGeometry().setFromPoints(vertices);

  // use indexed buffer geometry to reuse vertices
  geometry.setIndex(indices);

  // set uvs
  geometry.setAttribute("uv", new BufferAttribute(Float32Array.from(uvs), 2));

  // compute normals for lighting
  geometry.computeVertexNormals();

  return geometry;
}

function BezierMesh({ cubicA, cubicB, aspect }: BezierMeshProps): JSX.Element {
  const [mesh, setMesh] = useControls("mesh", () => ({
    show: false,
    color: {
      value: {
        r: 255 * Math.random(),
        g: 255 * Math.random(),
        b: 255 * Math.random(),
      },
      render: (get) => get("mesh.show"),
    },
    polygon: { value: true, render: (get) => get("mesh.show") },
    wireframe: {
      value: true,
      render: (get) => get("mesh.show") && get("mesh.polygon"),
    },
    light: {
      value: 500,
      min: 50,
      max: 1000,
      step: 50,
      render: (get) =>
        get("mesh.show") && get("mesh.polygon") && !get("mesh.wireframe"),
    },
  }));

  const points = meshPoints({ cubicA, cubicB, aspect });
  const color = mesh.color.r * 256 ** 2 + mesh.color.g * 256 + mesh.color.b;

  return (
    <>
      {mesh.show &&
        (mesh.polygon ? (
          <PolygonMesh
            wireframe={mesh.wireframe}
            color={color}
            points={points}
          />
        ) : (
          <PointsMesh color={color} points={points} />
        ))}
      <ambientLight intensity={2} color={0xffffff} />
      <PointLightCube radius={20} intensity={mesh.light} />
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

function nRand10(): number {
  return Math.random() * 10;
}

function rand10(): number {
  return Math.random() * 20 - 10;
}

function randCubic(): Cubic {
  return {
    start: new Vector3(-10, nRand10(), 0),
    midA: new Vector3(rand10(), rand10(), 0),
    midB: new Vector3(rand10(), rand10(), 0),
    end: new Vector3(10, nRand10(), 0),
  };
}

interface FramePlaneProps {
  video: HTMLVideoElement;
  aspect: number;
  mesh: BezierMeshProps;
}

function FramePlane({ video, aspect, mesh }: FramePlaneProps): JSX.Element {
  const [frames] = useControls("frames", () => ({
    show: true,
    intersect: true,
    wireframe: {
      value: false,
      render: (get) => get("frames.show"),
    },
    number: {
      value: 240,
      min: 1,
      max: 240,
      step: 1,
      render: (get) => get("frames.show"),
    },
    spacing: {
      value: 1.0,
      min: 0,
      max: 1,
      step: 0.01,
      render: (get) => get("frames.show") && get("frames.number") > 1,
    },
    position: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
      render: (get) =>
        get("frames.show") &&
        (get("frames.spacing") < 1 || get("frames.number") === 1),
    },
  }));

  // with requestAnimationFrame, continually load the video frames into allTextures based on the HTMLVideoElement playing
  // with useFrame, continually update textures by moving forward in time one frame and indexing into allTextures
  const [allTextures, setAllTextures] = useState<Texture[]>([]);

  // initialize at first frame
  const frameIndex = useRef(0);

  // when video changes, reset frameIndex and allTextures
  useEffect(() => {
    // clear allTextures using splice to avoid memory leak
    allTextures.splice(0, allTextures.length);
    setAllTextures(allTextures);

    frameIndex.current = 0;
  }, [video]);

  const loadFrame = useCallback(async () => {
    const imageBitmap = await createImageBitmap(video, {
      imageOrientation: "flipY",
    });
    const texture = new Texture(imageBitmap);
    texture.needsUpdate = true;

    allTextures.push(texture);
  }, [video]);

  // create a condition based on whether the video is playing
  const videoIsValid = useCallback(() => {
    return (
      !video.paused &&
      !video.ended &&
      video.videoWidth !== 0 &&
      video.videoHeight !== 0
    );
  }, [video]);

  useAnimationFrame(loadFrame, videoIsValid);

  // note! this is useFrame from React Three Fiber, not useFrame from useAnimationFrame
  // or even a "frame" from a video.
  /*
  useFrame(() => {
    if (allTextures.length < frames.number) {
      setTextures(
        textures.map((texture, i) =>
          i < frames.number - allTextures.length
            ? texture
            : allTextures[i - frames.number + allTextures.length],
        ),
      );
      return;
    }

    frameIndex.current = (frameIndex.current + 1) % allTextures.length;
    const newTextures = textures.map(
      (_, i) => allTextures[(frameIndex.current + i) % allTextures.length],
    );
    setTextures(newTextures);
  });
  */

  const positions = [];

  // if number is 1, then spacing is irrelevant and position is the only thing that matters; 0 means a y position of -10, 1 means a y position of 10
  // if number > 1, then:
  //   - spacing of 0 means planes are in the same place
  // if number > 1, then spacing of 1 means planes are as far apart as possible, and position is irrelevant
  // if number > 1, then spacing of 0.5 means planes are spaced at a distance half of if it were 1, and position moves the entire set of planes
  for (let i = 0; i < frames.number; i++) {
    let yPosition;
    if (frames.number === 1) {
      yPosition = frames.position * 20 - 10;
    } else {
      let maxSpacing = 20 / (frames.number - 1);
      let spacing = maxSpacing * frames.spacing;
      let maxOffset = 20 - spacing * (frames.number - 1);
      let offset = maxOffset * frames.position;
      yPosition = -10 + i * spacing + offset;
    }
    positions.push(new Vector3(0, yPosition, 0));
  }

  let subtraction: BufferGeometry = meshGeometry(meshPoints(mesh), true);
  if (frames.intersect) {
    subtraction.translate(100, 100, 100);
  }

  // create array of six materials to use for the six sides of the cube
  console.log("rendering frameplane");
  const materials = useCallback(
    (index: number) => {
      const textureIndex = allTextures.length - frames.number + index;
      const videoMaterial = new MeshBasicMaterial({
        map: allTextures[textureIndex] ?? new DataTexture(null),
        wireframe: frames.wireframe,
      });
      const transparentMaterial = new MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        wireframe: frames.wireframe,
      });
      return [
        transparentMaterial,
        transparentMaterial,
        transparentMaterial,
        transparentMaterial,
        videoMaterial, // top
        transparentMaterial,
      ];
    },
    [frameIndex, frames.wireframe, frames.number],
  );

  const boxGeometry = new BoxGeometry(19.8, 19.8 / aspect, 0.01);
  boxGeometry.groups.forEach((group, i) => {
    group.materialIndex = i;
  });

  return (
    <>
      {frames.show &&
        positions.map((position, index) => (
          <mesh key={index}>
            <Geometry computeVertexNormals useGroups>
              <Base
                geometry={boxGeometry}
                material={materials(index)}
                position={position}
                rotation={[-Math.PI / 2, 0, 0]}
              ></Base>
              <Subtraction geometry={subtraction}>
                <meshBasicMaterial color="white" transparent opacity={0} />
              </Subtraction>
            </Geometry>
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
  console.log("rendering slitscan");
  // add leva controls in the "slitscan" folder
  const [slitscan, setSlitscan] = useControls("slitscan", () => ({
    aspect: {
      value: 16 / 9,
      options: {
        "16:9": 16 / 9,
        "4:3": 4 / 3,
        "1:1": 1,
        "3:4": 3 / 4,
        "9:16": 9 / 16,
      },
    },
    rotate: true,
    webcam: false,
    video: {
      value: "/videos/breakdance.mp4",
      options: {
        breakdance: "/videos/breakdance.mp4",
        finance: "/videos/finance.mp4",
        manhattan: "/videos/manhattan.mp4",
        tokyo: "/videos/tokyo.mp4",
        waves: "/videos/waves.mp4",
      },
      render: (get) => !get("slitscan.webcam"),
    },
  }));

  // add a keyboard listener to toggle rotation
  useEffect(() => {
    function onKeyUp(event: KeyboardEvent) {
      if (event.key === " ") {
        setSlitscan({ rotate: !slitscan.rotate });
      }
    }

    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [slitscan.rotate]);

  const video = useVideo(slitscan.video);

  // rotate the camera around the origin if slitscan.rotate is true
  useFrame(({ clock, camera }) => {
    if (!slitscan.rotate) {
      return;
    }
    const radius = 10;
    const speed = 0.4;
    const angle = clock.getElapsedTime() * speed;
    camera.position.x = radius * Math.cos(angle);
    camera.position.y = 10 + (radius * Math.sin(angle) + radius) / 4;
    camera.position.z = radius * Math.sin(angle);
    camera.lookAt(0, 0, 0);
  });

  // add leva controls in the "helper" folder
  const [helpers] = useControls("helpers", () => ({
    axes: false,
    "bounding box": true,
  }));

  const meshProps = {
    cubicA,
    cubicB,
    aspect: slitscan.aspect,
  };

  return (
    <>
      {helpers.axes && <axesHelper args={[12]} />}
      {helpers["bounding box"] && (
        <box3Helper
          args={[
            new Box3(
              new Vector3(-9.9, -10, -9.9 / slitscan.aspect),
              new Vector3(9.9, 10, 9.9 / slitscan.aspect),
            ),
            new Color("black"),
          ]}
        />
      )}
      <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 - 0.01} />
      <BezierMesh cubicA={cubicA} cubicB={cubicB} aspect={slitscan.aspect} />
      <FramePlane video={video} aspect={slitscan.aspect} mesh={meshProps} />
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
        <Canvas
          /* @ts-ignore: eventSource not worth dealing with */
          eventSource={eventSource}
          style={{ position: "absolute" }}
          orthographic
        >
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
