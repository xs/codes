import { Grid } from "../lib/Grid";
import React, { useState } from "react";

const InputBitmap: React.FC = () => {
  const [inputGrid, setInputGrid] = useState<Grid<number>>(
    new Grid({ rows: 4, cols: 4, init: 0 }),
  );

  const togglePixel = (row: number, col: number) => {
    setInputGrid((prevGrid) => {
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
              {inputGrid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((pixel, colIndex) => (
                    <div
                      className={`w-6 h-6 ${
                        i != 1 || j != 1 ? "opacity-40" : ""
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
                      style={{ backgroundColor: pixel === 0 ? "red" : "blue" }}
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
