import { Grid } from "./Grid";

interface WaveElementProps<T> {
  output: Grid<T | undefined>; // pixels are either observed or not
  patterns: Grid<T>[]; // all possible patterns
}

export class WaveElement<T> {
  output: Grid<T>;
  patterns: Grid<T>[];

  constructor({ output, patterns }: WaveElementProps<any>) {
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

  // return 0 if there is only one legal pattern left, otherwise return legal patterns / total patterns
  entropy(): number {
    let legalPatterns = this.patterns.filter((pattern) => this.legal(pattern));
    return legalPatterns.length <= 1
      ? 0
      : legalPatterns.length / this.patterns.length;
  }

  contradiction(): boolean {
    return this.patterns.every((pattern) => !this.legal(pattern));
  }
}
