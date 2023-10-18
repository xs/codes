import React, { useState } from "react";

type Grid = number[][];

interface InputBitmapProps {
  initialGrid: Grid;
}

const InputBitmap: React.FC<InputBitmapProps> = ({ initialGrid }) => {
  const [grid, setGrid] = useState<Grid>(initialGrid);

  const togglePixel = (row: number, col: number) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[row][col] = newGrid[row][col] === 0 ? 1 : 0;
      console.table(newGrid);
      return newGrid;
    });
  };

  return (
    <div>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((pixel, colIndex) => (
            <div
              className="w-6 h-6"
              key={`${rowIndex}-${colIndex}}`}
              onClick={() => {
                console.log("toggling pixel", rowIndex, colIndex);
                togglePixel(rowIndex, colIndex);
              }}
              style={{ backgroundColor: pixel === 0 ? "red" : "blue" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default InputBitmap;
