import { Grid } from "../lib/Grid";
import React, { useState } from "react";

interface WaveProps {
  outputDim: [number, number];
  elementDim?: [number, number];
}

const Wave: React.FC<WaveProps> = ({ outputDim, elementDim = [3, 3] }) => {
  const [outputWidth, outputHeight] = outputDim;
  const [elementWidth, elementHeight] = elementDim;

  if (!(outputWidth >= elementWidth && outputHeight > elementHeight)) {
    throw new Error(
      "Output dimensions must be greater than wave element dimensions",
    );
  }

  return <div></div>;
};

export default Wave;
