import { Grid } from "../lib/Grid";
import GridDisplay from "./GridDisplay";
import { useControls } from "leva";
import React from "react";

interface InputBitmapProps {
  input: Grid<number>;
  setInput: React.Dispatch<React.SetStateAction<Grid<number>>>;
}

const InputBitmap: React.FC<InputBitmapProps> = ({ input, setInput }) => {
  const [inputSettings] = useControls("input", () => ({
    pixelSize: {
      value: 6,
      min: 3,
      max: 10,
      step: 1,
    },
  }));

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
                pixelSize={inputSettings.pixelSize}
                opacity={i === 1 && j === 1 ? 100 : 40}
                colorMap={{
                  0: "bg-yellow-400 hover:bg-yellow-500",
                  1: "bg-green-500 hover:bg-green-600",
                }}
                onClick={togglePixel}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default InputBitmap;
