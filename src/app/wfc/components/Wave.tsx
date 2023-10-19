import { Grid } from "../lib/Grid";
import { WaveElement } from "../lib/WaveElement";
import { button, useControls } from "leva";
import { sample } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface WaveProps {
  input: Grid<number>;
  height: number;
  width: number;
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

  const [output, setOutput] = useState(initOutput(height, width));

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

  useEffect(() => {
    let newOutput = initOutput(height, width);

    const makeWaveElement = (row: number, col: number): WaveElement<number> => {
      return new WaveElement({
        output: newOutput.slice(row, col, elementDim),
        patterns: input.getPatterns(elementDim),
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

    console.log("entropy", min);

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
    <div>
      {Array.from({ length: height }, (_, row) => (
        <div key={row} className="flex">
          {Array.from({ length: width }, (_, col) => {
            switch (output.get(row, col)) {
              case 0:
                return (
                  <div
                    key={col}
                    className="w-3 h-3 bg-yellow-400 hover:bg-yellow-500"
                  />
                );
              case 1:
                return (
                  <div
                    key={col}
                    className="w-3 h-3 bg-green-500 hover:bg-green-600"
                  />
                );
              default:
                return (
                  <div
                    key={col}
                    className="w-3 h-3 bg-gray-300 hover:bg-gray-600"
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
