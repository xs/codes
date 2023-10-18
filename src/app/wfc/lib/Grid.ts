interface GridProps<T> {
  rows: number;
  cols: number;
  init: T | (() => T);
}

export class Grid<T> {
  grid: T[][];
  init: T | (() => T);

  constructor({ rows, cols, init }: GridProps<T>) {
    this.grid = [];
    this.init = init;
    for (let i = 0; i < rows; i++) {
      if (typeof init === "function") {
        this.grid[i] = Array(cols)
          .fill(undefined)
          .map(init as () => T);
      } else {
        this.grid[i] = Array(cols).fill(init);
      }
    }
  }

  height(): number {
    return this.grid.length;
  }

  width(): number {
    return this.grid[0].length;
  }

  set(row: number, col: number, val: T): void {
    this.grid[row][col] = val;
  }

  get(row: number, col: number): T {
    return this.grid[row][col];
  }

  clone(): Grid<T> {
    let newGrid = new Grid<T>({
      rows: this.height(),
      cols: this.width(),
      init: this.init,
    });

    for (let row = 0; row < this.height(); row++) {
      for (let col = 0; col < this.width(); col++) {
        newGrid.set(row, col, this.get(row, col));
      }
    }

    return newGrid;
  }

  map<U>(func: (value: T[], index: number) => U): U[] {
    return this.grid.map(func);
  }

  log(): void {
    console.table(this.grid);
  }
}
