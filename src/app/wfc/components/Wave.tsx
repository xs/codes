import { Grid } from "../lib/Grid";
import { WaveElement } from "../lib/WaveElement";
import React, { useEffect, useState } from "react";

interface WaveProps {
  input: Grid<number>;
  height: number;
  width: number;
  elementDim?: number;
}

const Wave: React.FC<WaveProps> = ({
  input,
  height,
  width,
  elementDim = 3,
}) => {
  if (!(height >= elementDim && width >= elementDim)) {
    throw new Error(
      "Output dimensions must be greater than wave element dimensions",
    );
  }

  const patterns = input.getPatterns(elementDim);

  const output = React.useRef(
    new Grid<number | undefined>({
      rows: height,
      cols: width,
      init: undefined,
    }),
  );

  useEffect(() => {
    console.log("resetting output");
    output.current = new Grid<number | undefined>({
      rows: height,
      cols: width,
      init: undefined,
    });
    for (
      let i = 0;
      i < (height - elementDim + 1) * (width - elementDim + 1);
      i++
    ) {
      observe();
    }
  }, [height, width, input]);

  const makeWaveElement = (row: number, col: number): WaveElement<number> => {
    return new WaveElement({
      output: output.current.slice(row, col, elementDim),
      patterns: patterns,
    });
  };
  const waveElements = new Grid<WaveElement<number>>({
    rows: height - elementDim + 1,
    cols: width - elementDim + 1,
    init: makeWaveElement,
  });

  const observe = () => {
    let min = Infinity;
    let minPositions: {
      row: number;
      col: number;
      waveElement: WaveElement<number>;
    }[] = [];

    waveElements.grid.forEach((row, r) => {
      row.forEach((waveElement, c) => {
        if (waveElement.contradiction() || waveElement.observed()) {
          return;
        }
        const entropy = waveElement.entropy();
        if (entropy < min) {
          min = entropy;
          minPositions = [{ row: r, col: c, waveElement: waveElement }];
        } else if (entropy === min) {
          minPositions.push({ row: r, col: c, waveElement: waveElement });
        }
      });
    });

    const randomPosition =
      minPositions[Math.floor(Math.random() * minPositions.length)];

    const newOutput = output.current.clone();
    newOutput.write(
      randomPosition.row,
      randomPosition.col,
      randomPosition.waveElement.observe(),
    );
    output.current = newOutput;
  };

  return (
    <div>
      {Array.from({ length: height }, (_, row) => (
        <div key={row} className="flex">
          {Array.from({ length: width }, (_, col) => {
            switch (output.current.get(row, col)) {
              case 0:
                return (
                  <div
                    key={col}
                    className="w-4 h-4 bg-blue-300 hover:bg-blue-600"
                  />
                );
              case 1:
                return (
                  <div
                    key={col}
                    className="w-4 h-4 bg-red-300 hover:bg-red-600"
                  />
                );
              default:
                return (
                  <div
                    key={col}
                    className="w-4 h-4 bg-gray-300 hover:bg-gray-600"
                  />
                );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Wave;
