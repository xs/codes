import { Grid } from "../lib/Grid";
import { WaveElement } from "../lib/WaveElement";
import React, { useState } from "react";

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
  const patterns = input.getPatterns(elementDim);

  const output = new Grid<number | undefined>({
    rows: height,
    cols: width,
    init: undefined,
  });

  const makeWaveElement = (row: number, col: number) => {
    return new WaveElement({
      output: output.slice(row, col, elementDim),
      patterns: patterns,
    });
  };
  const waveElements = new Grid({
    rows: height - elementDim + 1,
    cols: width - elementDim + 1,
    init: makeWaveElement,
  });

  if (!(height >= elementDim && width >= elementDim)) {
    throw new Error(
      "Output dimensions must be greater than wave element dimensions",
    );
  }

  return (
    <div>
      {Array.from({ length: height }, (_, y) => (
        <div key={y} className="flex">
          {Array.from({ length: width }, (_, x) => (
            <div key={x} className="w-4 h-4 bg-blue-300 hover:bg-blue-600" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Wave;
