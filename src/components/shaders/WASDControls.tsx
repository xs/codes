"use client";

import { PointerLockControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";

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
    "sprinting (with shift key)": false,
  }));

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

  useFrame(({ camera }) => {
    // set the camera's direction to the direction the user is looking
    const direction = new Vector3();
    camera.getWorldDirection(direction);

    setDebug({
      cameraDirection: toLeva(direction),
      position: toLeva(camera.position),
      "sprinting (with shift key)": sprinting.current,
    });

    // use forwardMovement and sideMovement to move the camera
    const forwardVec = new Vector3(direction.x, 0, direction.z);
    const sideVec = forwardVec.clone().cross(new Vector3(0, 1, 0));

    const cameraForward = forwardVec.clone();
    const cameraSide = sideVec.clone();

    camera.worldToLocal(cameraForward);
    camera.worldToLocal(cameraSide);

    forwardVec.normalize();
    sideVec.normalize();

    camera.translateOnAxis(forwardVec, forwardMovement.current * 0.1);
    camera.translateOnAxis(sideVec, sideMovement.current * 0.1);
  });

  return <PointerLockControls />;
}
