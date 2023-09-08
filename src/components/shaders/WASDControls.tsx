"use client";

import { PointerLockControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { Vector2, Vector3 } from "three";

type LevaVector3 = { x: number; y: number; z: number };

export default function WASDControls(): JSX.Element {
  const sprinting = useRef<boolean>(false);

  function toLeva(vec: Vector3): LevaVector3 {
    return { x: vec.x, y: vec.y, z: vec.z };
  }

  const vec3 = { x: 0, y: 0, z: 0 };
  // use the leva library to display any debug info
  const [, setDebug] = useControls(() => ({
    cameraDirection: { value: vec3 },
    position: { value: vec3 },
    forward: 0,
    side: 0,
    "sprinting (with shift key)": false,
  }));

  // forward is positive, backward is negative
  const forward = useRef(false);
  const backward = useRef(false);
  const right = useRef(false);
  const left = useRef(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case "Shift":
          sprinting.current = true;
          break;
        case "w":
          forward.current = true;
          break;
        case "a":
          left.current = true;
          break;
        case "s":
          backward.current = true;
          break;
        case "d":
          right.current = true;
          break;
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      switch (event.key) {
        case "Shift":
          sprinting.current = false;
          break;
        case "w":
          forward.current = false;
          break;
        case "a":
          left.current = false;
          break;
        case "s":
          backward.current = false;
          break;
        case "d":
          right.current = false;
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame(({ camera }) => {
    // set the camera's direction to the direction the user is looking
    const direction = new Vector3();
    camera.getWorldDirection(direction);

    const speed = sprinting.current ? 0.2 : 0.1;

    const forwardMovement =
      (forward.current ? 1 : 0) - (backward.current ? 1 : 0);
    const sideMovement = (right.current ? 1 : 0) - (left.current ? 1 : 0);

    setDebug({
      cameraDirection: toLeva(direction),
      position: toLeva(camera.position),
      "sprinting (with shift key)": sprinting.current,
      forward: forwardMovement,
      side: sideMovement,
    });

    const horizontal = new Vector2(direction.x, direction.z).length();
    const vertical = direction.y;

    // "forward" is the direction the camera is looking, which is the negative z axis
    const forwardVec = new Vector3(0, -vertical, -horizontal);
    // "side" is the camera's right, which is the positive x axis.

    // TODO: bug here where if we look to the side, then left and right are pitched? rolled? yawed?
    const sideVec = new Vector3(1, 0, 0);

    camera.translateOnAxis(forwardVec, forwardMovement * speed);
    camera.translateOnAxis(sideVec, sideMovement * speed);
  });

  return <PointerLockControls />;
}
