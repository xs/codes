"use client";

import { PointerLockControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";

export default function WASDControls(): JSX.Element {
  const sprinting = useRef<Boolean>(false);
  const cameraDirection = useRef<Vector3>(new Vector3());
  const cameraPosition = useRef<Vector3>(new Vector3());

  // forward is positive, backward is negative
  const forwardMovement = useRef(0);

  // right is positive, left is negative
  const sideMovement = useRef(0);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case "Shift":
          sprinting.current = true;
          break;
        case "w":
          forwardMovement.current += 1;
          break;
        case "a":
          sideMovement.current -= 1;
          break;
        case "s":
          forwardMovement.current -= 1;
          break;
        case "d":
          sideMovement.current += 1;
          break;
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      switch (event.key) {
        case "Shift":
          sprinting.current = false;
          break;
        case "w":
        case "s":
          forwardMovement.current = 0;
          break;
        case "a":
        case "d":
          sideMovement.current = 0;
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

  function logVec(vec: Vector3, label: string) {
    // round each component to 2 decimal places
    const x = Math.round(vec.x * 100) / 100;
    const y = Math.round(vec.y * 100) / 100;
    const z = Math.round(vec.z * 100) / 100;
    console.log(`${label}: (${x}, ${y}, ${z})`);
  }

  useFrame(({ camera }) => {
    // set the camera's direction to the direction the user is looking
    const direction = new Vector3();
    camera.getWorldDirection(direction);

    cameraDirection.current = direction;
    cameraPosition.current = camera.position;

    // project to xz plane, then normalize
    cameraDirection.current.y = 0;
    cameraDirection.current.normalize();

    // use forwardMovement and sideMovement to move the camera
    const forwardVec = cameraDirection.current.clone();
    const sideVec = forwardVec.clone().cross(new Vector3(0, 1, 0));

    camera.worldToLocal(forwardVec);
    camera.worldToLocal(sideVec);

    forwardVec.normalize();
    sideVec.normalize();

    camera.translateOnAxis(forwardVec, forwardMovement.current * 0.1);
    camera.translateOnAxis(sideVec, sideMovement.current * 0.1);
  });

  return (
    <>
      <PointerLockControls />
    </>
  );
}
