import { Grid } from "./Grid";

interface WaveElementProps<T> {
  rows: number;
  cols: number;
  output: Grid<T | undefined>; // pixels are either observed or not
  patterns: Grid<T>[]; // all possible patterns
}

export class WaveElement<T> {
  rows: number;
  cols: number;
  output: Grid<T>;
  patterns: Grid<T>[];

  constructor({ rows, cols, output, patterns }: WaveElementProps<any>) {
    this.rows = rows;
    this.cols = cols;
    this.output = output;
    this.patterns = patterns;
  }

  legal(pattern: Grid<T>): boolean {
    return this.output.grid.every((row, r) => {
      row.some((pixel: T, c: number) => {
        return pixel === undefined || pattern.get(r, c) === pixel;
      });
    });
  }
}
