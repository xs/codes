import { Grid } from "../lib/Grid";
import InputBitmap from "./InputBitmap";
import Wave from "./Wave";
import { Leva, useControls } from "leva";
import React, { useEffect, useState } from "react";

const WFC: React.FC = () => {
  const [controls, setControls] = useControls("input", () => ({
    height: {
      value: 4,
      min: 3,
      max: 10,
      step: 1,
    },
    width: {
      value: 4,
      min: 3,
      max: 10,
      step: 1,
    },
  }));

  const [input, setInput] = useState<Grid<number>>(
    new Grid({ rows: controls.height, cols: controls.width, init: 0 }),
  );

  // stretch / shrink input grid to match controls
  useEffect(() => {
    const newGrid = new Grid({
      rows: controls.height,
      cols: controls.width,
      init: 0,
    });
    newGrid.grid.forEach((row, i) => {
      row.forEach((_, j) => {
        const oldI = Math.min(i, input.height() - 1);
        const oldJ = Math.min(j, input.width() - 1);
        newGrid.set(i, j, input.get(oldI, oldJ));
      });
    });
    setInput(newGrid);
  }, [controls.height, controls.width]);

  return (
    <div className="flex w-full landscape:flex-row portrait:flex-col h-[calc(100dvh)]">
      <Leva />
      <div className="landscape:w-1/2 landscape:h-full portrait:h-1/2 portrait:w-full items-center justify-center flex">
        <InputBitmap input={input} setInput={setInput} />
      </div>
      <div className="flex landscape:w-1/2 landscape:h-full portrait:h-1/2 portrait:w-full items-center justify-center">
        <Wave width={40} height={30} input={input} />
      </div>
    </div>
  );
};

export default WFC;
