import { Grid } from "../lib/Grid";
import React, { useEffect, useState } from "react";

interface InputBitmapProps {
  input: Grid<number>;
  setInput: React.Dispatch<React.SetStateAction<Grid<number>>>;
}

const InputBitmap: React.FC<InputBitmapProps> = ({ input, setInput }) => {
  const togglePixel = (row: number, col: number) => {
    setInput((prevGrid) => {
      const newGrid = prevGrid.clone();
      newGrid.set(row, col, prevGrid.get(row, col) === 0 ? 1 : 0);
      return newGrid;
    });
  };

  return (
    <div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex">
          {[...Array(3)].map((_, j) => (
            <div key={j}>
              {input.grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((pixel, colIndex) => (
                    <div
                      className={`w-6 h-6 ${
                        i != 1 || j != 1 ? "opacity-40" : ""
                      } ${
                        pixel === 0
                          ? "bg-yellow-400 hover:bg-yellow-500"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => {
                        console.log(
                          "toggling pixel",
                          rowIndex,
                          colIndex,
                          "from",
                          pixel,
                          "to",
                          pixel === 0 ? 1 : 0,
                        );
                        togglePixel(rowIndex, colIndex);
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default InputBitmap;
