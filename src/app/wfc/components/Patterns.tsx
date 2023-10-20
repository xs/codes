import { Grid } from "../lib/Grid";
import GridDisplay from "./GridDisplay";
import { useControls } from "leva";
import React from "react";

interface PatternsProps {
  input: Grid<number>;
  rotations: boolean;
  colorMap: string[];
}

const Patterns: React.FC<PatternsProps> = ({ input, rotations, colorMap }) => {
  const patterns = input.getPatterns(3, rotations);

  return (
    <div className="flex-wrap m-2 inline-flex">
      {patterns.map((pattern, i) => (
        <div className="m-2" key={i}>
          <GridDisplay pixelSize={3} grid={pattern} colorMap={colorMap} />
        </div>
      ))}
    </div>
  );
};

export default Patterns;
