import { Grid } from "../lib/Grid";
import GridDisplay from "./GridDisplay";
import React, { useEffect, useState } from "react";

interface InputBitmapProps {
  input: Grid<number>;
  setInput: React.Dispatch<React.SetStateAction<Grid<number>>>;
}

const InputBitmap: React.FC<InputBitmapProps> = ({ input, setInput }) => {
  const togglePixel = (row: number, col: number) => {
    const newInput = input.clone();
    newInput.set(row, col, input.get(row, col) === 0 ? 1 : 0);
    setInput(newInput);
  };

  return (
    <div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex">
          {[...Array(3)].map((_, j) => (
            <div key={j}>
              <GridDisplay
                grid={input}
                pixelSize={6}
                opacity={i === 1 && j === 1 ? 100 : 40}
                colorMap={{
                  0: ["yellow", 400],
                  1: ["green", 500],
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default InputBitmap;
