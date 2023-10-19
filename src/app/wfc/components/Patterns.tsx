import { Grid } from "../lib/Grid";
import GridDisplay from "./GridDisplay";
import { useControls } from "leva";
import React from "react";

interface PatternsProps {
  input: Grid<number>;
}

const Patterns: React.FC<PatternsProps> = ({ input }) => {
  const [inputSettings] = useControls("patterns", () => ({
    rotations: false,
  }));

  const patterns = input.getPatterns(3, inputSettings.rotations);

  return (
    <div className="flex flex-wrap space-x-4 space-y-4">
      {patterns.map((pattern, i) => (
        <GridDisplay
          pixelSize={3}
          grid={pattern}
          colorMap={{
            0: "bg-yellow-400 hover:bg-yellow-500",
            1: "bg-green-500 hover:bg-green-600",
          }}
        />
      ))}
    </div>
  );
};

export default Patterns;
