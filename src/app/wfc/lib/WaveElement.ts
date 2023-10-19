import { Grid } from "./Grid";
import sample from "lodash/sample";

interface WaveElementProps<T> {
  output: Grid<T | undefined>; // pixels are either observed or not
  patterns: Grid<T>[]; // all possible patterns
}

export class WaveElement<T> {
  output: Grid<T | undefined>;
  patterns: Grid<T>[];

  constructor({ output, patterns }: WaveElementProps<any>) {
    this.output = output;
    this.patterns = patterns;
  }

  legal(pattern: Grid<T>): boolean {
    return this.output.grid.every((row, r: number) => {
      return row.every((pixel: T | undefined, c: number) => {
        return pixel === undefined || pattern.get(r, c) === pixel;
      });
    });
  }

  // return 0 if there is only one legal pattern left, otherwise return legal patterns / total patterns
  // first number is available patterns, second number is observed pixels
  entropy(): [number, number] {
    let legalPatterns = this.patterns.filter((pattern) => this.legal(pattern));

    const patternEntropy =
      legalPatterns.length <= 1
        ? 0
        : legalPatterns.length / this.patterns.length;

    const pixelEntropy = this.output.grid.reduce((acc, row) => {
      return acc + row.filter((pixel) => pixel === undefined).length;
    }, 0);

    return [patternEntropy, pixelEntropy];
  }

  contradiction(): boolean {
    return this.patterns.every((pattern) => !this.legal(pattern));
  }

  log(): void {
    console.log("wave element", this);
    console.log("output:");
    console.table(this.output.grid);
  }

  observed(): boolean {
    return this.output.grid.every((row) => {
      return row.every((pixel) => pixel !== undefined);
    });
  }

  collapsed(): boolean {
    return this.patterns.length === 1;
  }

  // return a random legal pattern
  collapse(): Grid<T> {
    const legalPatterns = this.patterns.filter((pattern) =>
      this.legal(pattern),
    );

    if (legalPatterns.length === 0) {
      throw new Error("No legal patterns available");
    }

    const pattern = sample(legalPatterns) as Grid<T>;
    this.output = pattern;

    console.log("observed out of ", legalPatterns.length, " legal patterns:");
    console.table(pattern.grid);

    return pattern;
  }

  propagate(observation: Grid<T | undefined>): void {
    for (let row = 0; row < observation.height(); row++) {
      for (let col = 0; col < observation.width(); col++) {
        const currentPixel = this.output.get(row, col);
        const observedPixel = observation.get(row, col);
        this.output.set(row, col, currentPixel || observedPixel);
      }
    }
  }
}
