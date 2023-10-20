import { Grid } from "../lib/Grid";
import { WaveElement } from "../lib/WaveElement";
import GridDisplay from "./GridDisplay";
import { button, useControls } from "leva";
import { sample } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface WaveProps {
  input: Grid<number>;
  height: number;
  width: number;
  rotations: boolean;
  colorMap: string[];
  elementDim?: number;
}

const initOutput = (
  height: number,
  width: number,
): Grid<number | undefined> => {
  return new Grid<number | undefined>({
    rows: height,
    cols: width,
    init: undefined,
  });
};

const OutputWave: React.FC<WaveProps> = ({
  input,
  height,
  width,
  rotations,
  colorMap,
  elementDim = 3,
}) => {
  if (!(height >= elementDim && width >= elementDim)) {
    throw new Error(
      "Output dimensions must be greater than wave element dimensions",
    );
  }

  const [output, setOutput] = useState(initOutput(height, width));

  const [outputSettings] = useControls("output", () => ({
    pixelSize: {
      value: 3,
      min: 1,
      max: 6,
      step: 1,
    },
  }));

  useControls(
    "wave",
    () => ({
      observe: button(() => {
        console.log("observe");
        setOutput(observe(output, waveElements.current));
      }),
      "observe 10x": button(() => {
        let newOutput = output.clone();
        for (let i = 0; i < 10; i++) {
          newOutput = observe(newOutput, waveElements.current);
        }
        setOutput(newOutput);
      }),
      "observe all": button(() => {
        let newOutput = output.clone();
        while (true) {
          newOutput = observe(newOutput, waveElements.current);
          if (
            waveElements.current
              .mapCells((waveElement) => waveElement.observed())
              .grid.every((row) => row.every((observed) => observed))
          ) {
            break;
          }
        }
        setOutput(newOutput);
      }),
      clear: button(() => {
        reset();
      }),
      "log output": button(() => {
        console.table(output.grid);
      }),
      "show entropies": button(() => {
        const entropies = waveElements.current.mapCells((waveElement) => {
          return waveElement
            .entropy()
            .map((entropy) => entropy.toFixed(3))
            .toString();
        });
        console.table(entropies.grid);
      }),
    }),
    [output, setOutput],
  );

  const waveElements = useRef(
    new Grid<WaveElement<number>>({
      rows: height - elementDim + 1,
      cols: width - elementDim + 1,
      init: undefined,
    }),
  );

  const reset = () => {
    let newOutput = initOutput(height, width);

    const makeWaveElement = (row: number, col: number): WaveElement<number> => {
      return new WaveElement({
        output: newOutput.slice(row, col, elementDim),
        patterns: input.getPatterns(elementDim, rotations),
      });
    };

    // console.log("resetting wave elements");
    waveElements.current = new Grid<WaveElement<number>>({
      rows: height - elementDim + 1,
      cols: width - elementDim + 1,
      init: makeWaveElement,
    });

    newOutput = observe(newOutput, waveElements.current);

    setOutput(newOutput);
  };

  useEffect(() => {
    reset();
  }, [height, width, input]);

  const observe = (
    outputGrid: Grid<number | undefined>,
    waveElementGrid: Grid<WaveElement<number>>,
  ): Grid<number | undefined> => {
    let min = [Infinity, Infinity];
    let minPositions: {
      row: number;
      col: number;
      waveElement: WaveElement<number>;
    }[] = [];

    waveElementGrid.grid.forEach((row, r) => {
      row.forEach((waveElement, c) => {
        if (waveElement.contradiction() || waveElement.observed()) {
          return;
        }
        const [patternEntropy, pixelEntropy] = waveElement.entropy();
        if (
          patternEntropy < min[0] ||
          (patternEntropy === min[0] && pixelEntropy < min[1])
        ) {
          min = [patternEntropy, pixelEntropy];
          minPositions = [{ row: r, col: c, waveElement: waveElement }];
        } else if (patternEntropy === min[0] && pixelEntropy === min[1]) {
          minPositions.push({ row: r, col: c, waveElement: waveElement });
        }
      });
    });

    // TODO: handle edge case of no positions
    const {
      row: observedRow,
      col: observedCol,
      waveElement: observedWaveElement,
    } = sample(minPositions) as {
      row: number;
      col: number;
      waveElement: WaveElement<number>;
    };

    const newOutput = outputGrid.clone();
    const observedPattern = observedWaveElement.collapse();
    newOutput.write(observedRow, observedCol, observedPattern);

    // propagate collapsed wave element to neighbors
    const lowestRow = Math.max(0, observedRow - elementDim + 1);
    const highestRow = Math.min(
      height - elementDim,
      observedRow + elementDim - 1,
    );

    const lowestCol = Math.max(0, observedCol - elementDim + 1);
    const highestCol = Math.min(
      width - elementDim,
      observedCol + elementDim - 1,
    );

    for (let r = lowestRow; r <= highestRow; r++) {
      for (let c = lowestCol; c <= highestCol; c++) {
        const waveElement = waveElementGrid.get(r, c);
        const rowOffset = observedRow - r;
        const colOffset = observedCol - c;
        const propagatedPattern = observedPattern.shift(rowOffset, colOffset);

        waveElement.propagate(propagatedPattern);
      }
    }
    return newOutput;
  };

  return (
    <GridDisplay
      grid={output}
      pixelSize={outputSettings.pixelSize}
      colorMap={colorMap}
    />
  );
};

export default OutputWave;
