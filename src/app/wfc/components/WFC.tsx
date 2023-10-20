import { Grid } from "../lib/Grid";
import InputBitmap from "./InputBitmap";
import OutputWave from "./OutputWave";
import Patterns from "./Patterns";
import { Leva, useControls } from "leva";
import React, { useEffect, useState } from "react";

const WFC: React.FC = () => {
  const [input] = useControls("input", () => ({
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

  const [output] = useControls("output", () => ({
    height: {
      value: 40,
      min: 3,
      max: 100,
      step: 1,
    },
    width: {
      value: 30,
      min: 3,
      max: 100,
      step: 1,
    },
  }));

  const [inputGrid, setInputGrid] = useState<Grid<number>>(
    new Grid({ rows: input.height, cols: input.width, init: 0 }),
  );

  // stretch / shrink input grid to match controls
  useEffect(() => {
    console.log("resizing input grid", input);
    const newGrid = new Grid({
      rows: input.height,
      cols: input.width,
      init: 0,
    });
    newGrid.grid.forEach((row, i) => {
      row.forEach((_, j) => {
        const oldI = Math.min(i, inputGrid.height() - 1);
        const oldJ = Math.min(j, inputGrid.width() - 1);
        newGrid.set(i, j, inputGrid.get(oldI, oldJ));
      });
    });
    setInputGrid(newGrid);
  }, [input]);

  return (
    <div className="flex w-full landscape:flex-row portrait:flex-col h-[calc(100dvh)]">
      <Leva
        hideCopyButton
        titleBar={{
          title: "wave function collapse",
        }}
      />
      <div className="landscape:w-1/2 landscape:h-full portrait:h-1/2 portrait:w-full items-center justify-center flex flex-col portrait:flex-row">
        <div className="landscape:w-full landscape:h-2/3 portrait:h-full portrait:w-2/3 bg-gray-100 items-center justify-center flex">
          <InputBitmap input={inputGrid} setInput={setInputGrid} />
        </div>
        <div className="landscape:w-full landscape:h-1/3 portrait:h-full portrait:w-1/3 bg-gray-200 items-center justify-center overflow-scroll">
          <Patterns input={inputGrid} />
        </div>
      </div>
      <div className="flex landscape:w-1/2 landscape:h-full portrait:h-1/2 portrait:w-full items-center justify-center">
        <OutputWave
          width={output.width}
          height={output.height}
          input={inputGrid}
        />
      </div>
    </div>
  );
};

export default WFC;
