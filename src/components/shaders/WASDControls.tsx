"use client";

import { PointerLockControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { MutableRefObject, useEffect, useRef } from "react";
import { Vector2, Vector3 } from "three";

type LevaVector3 = { x: number; y: number; z: number };

// TODO: allow Gallery to use this camera's position to spawn and despawn Pieces
export default function WASDControls(): JSX.Element {
  function toLeva(vec: Vector3): LevaVector3 {
    return { x: vec.x, y: vec.y, z: vec.z };
  }

  const vec3 = { x: 0, y: 0, z: 0 };

  // use the leva library to display any debug info
  const [, setDebug] = useControls(() => ({
    "camera direction": { value: vec3 },
    "current position": { value: vec3 },
    forward: 0,
    side: 0,
    "sprinting (with shift key)": false,
  }));

  // forward is positive, backward is negative
  const forward = useRef<boolean>(false);
  const backward = useRef<boolean>(false);
  const right = useRef<boolean>(false);
  const left = useRef<boolean>(false);
  const sprinting = useRef<boolean>(false);

  const keyMap: Record<string, MutableRefObject<boolean>> = {
    Shift: sprinting,
    w: forward,
    W: forward,
    a: left,
    A: left,
    s: backward,
    S: backward,
    d: right,
    D: right,
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key in keyMap) {
        keyMap[event.key].current = true;
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.key in keyMap) {
        keyMap[event.key].current = false;
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

    // use the shift key to sprint
    const speed = sprinting.current ? 0.2 : 0.1;

    // calculate forward and side movement
    const forwardMovement =
      (forward.current ? 1 : 0) - (backward.current ? 1 : 0);
    const sideMovement = (right.current ? 1 : 0) - (left.current ? 1 : 0);

    // update the debug info for Leva
    setDebug({
      "camera direction": toLeva(direction),
      "current position": toLeva(camera.position),
      "sprinting (with shift key)": sprinting.current,
      forward: forwardMovement,
      side: sideMovement,
    });

    // "forward" is the direction the camera is looking, in the negative z axis.
    // pointer lock controls allow the camera to look up and down, so we need to
    // correct our movement vector to account for that.
    const horizontal = new Vector2(direction.x, direction.z).length();
    const vertical = direction.y;
    const forwardVec = new Vector3(0, -vertical, -horizontal);

    // "side" is the camera's right, which is the positive x axis.
    const sideVec = new Vector3(1, 0, 0);

    camera.translateOnAxis(forwardVec, forwardMovement * speed);
    camera.translateOnAxis(sideVec, sideMovement * speed);
  });

  return <PointerLockControls />;
}
