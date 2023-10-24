import { Grid } from "../lib/Grid";
import GridDisplay from "./GridDisplay";
import { button, useControls } from "leva";
import React from "react";

interface InputBitmapProps {
  input: Grid<number>;
  setInput: React.Dispatch<React.SetStateAction<Grid<number>>>;
  colorMap: string[];
}

const InputBitmap: React.FC<InputBitmapProps> = ({
  input,
  setInput,
  colorMap,
}) => {
  const [inputSettings] = useControls(
    "input",
    () => ({
      pixelSize: {
        value: 6,
        min: 3,
        max: 10,
        step: 1,
      },
      clear: button(() => {
        setInput(input.clone().mapCells(() => 0));
      }),
    }),
    [input, setInput],
  );

  const togglePixel = (row: number, col: number) => {
    const newInput = input.clone();
    newInput.set(row, col, (input.get(row, col) + 1) % colorMap.length);
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
                colorMap={colorMap}
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
