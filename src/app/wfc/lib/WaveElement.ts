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
    return this.output.grid.every((row, r: number) => {
      return row.every((pixel: T, c: number) => {
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
  observe(): Grid<T> {
    const legalPatterns = this.patterns.filter((pattern) =>
      this.legal(pattern),
    );

    if (legalPatterns.length === 0) {
      throw new Error("No legal patterns available");
    }

    const randomIndex = Math.floor(Math.random() * legalPatterns.length);
    return legalPatterns[randomIndex];
  }
}
