"use client";

import InputBitmap from "./components/InputBitmap";
import { useState } from "react";

type Grid = number[][];

export default function Page() {
  const [grid, setGrid] = useState<Grid>(Array(4).fill(Array(4).fill(0)));

  return (
    <div className="h-[calc(100dvh)] flex justify-center items-center">
      <InputBitmap initialGrid={grid} />
    </div>
  );
}
