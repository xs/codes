interface GridProps<T> {
  rows: number;
  cols: number;
  init: T | ((row: number, col: number) => T) | undefined;
}

export class Grid<T> {
  grid: T[][];
  init: T | ((row: number, col: number) => T) | undefined;

  constructor({ rows, cols, init }: GridProps<T>) {
    this.grid = [];
    this.init = init;

    if (typeof this.init === "function") {
      for (let i = 0; i < rows; i++) {
        this.grid[i] = [];
        for (let j = 0; j < cols; j++) {
          this.grid[i][j] = (this.init as (row: number, col: number) => T)(
            i,
            j,
          );
        }
      }
    } else {
      for (let i = 0; i < rows; i++) {
        this.grid[i] = Array(cols).fill(this.init);
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

  // overwrite with given grid at given row and column
  write(row: number, col: number, grid: Grid<T>): void {
    for (let r = 0; r < grid.height(); r++) {
      for (let c = 0; c < grid.width(); c++) {
        this.set(row + r, col + c, grid.get(r, c));
      }
    }
  }

  get(row: number, col: number): T {
    if (!this.inBounds(row, col)) {
      throw new Error("Row or column out of bounds");
    }
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

  inBounds(row: number, col: number): boolean {
    return row >= 0 && row < this.height() && col >= 0 && col < this.width();
  }

  // shifts the grid by the given row and column offsets, filling in the new space with undefined
  shift(rowOffset: number, colOffset: number): Grid<T | undefined> {
    let newGrid = new Grid<T | undefined>({
      rows: this.height(),
      cols: this.width(),
      init: undefined,
    });

    for (let row = 0; row < this.height(); row++) {
      for (let col = 0; col < this.width(); col++) {
        if (this.inBounds(row + rowOffset, col + colOffset)) {
          newGrid.set(row + rowOffset, col + colOffset, this.get(row, col));
        }
      }
    }

    return newGrid;
  }

  map<U>(func: (value: T[], index: number) => U[]): U[][] {
    return this.grid.map(func);
  }

  mapCells<U>(func: (value: T, index: number) => U): Grid<U> {
    let newGrid = new Grid<U>({
      rows: this.height(),
      cols: this.width(),
      init: undefined,
    });

    for (let row = 0; row < this.height(); row++) {
      for (let col = 0; col < this.width(); col++) {
        newGrid.set(
          row,
          col,
          func(this.get(row, col), row * this.width() + col),
        );
      }
    }

    return newGrid;
  }

  log(): void {
    console.table(this.grid);
  }

  getPatterns(n: number): Grid<T>[] {
    const inputHeight = this.height();
    const inputWidth = this.width();
    if (inputHeight < n || inputWidth < n) {
      throw new Error("Rows or columns cannot be less than n");
    }

    const patterns: Grid<T>[] = [];

    for (let row = 0; row < inputHeight; row++) {
      for (let col = 0; col < inputWidth; col++) {
        const pattern = new Grid<T>({
          rows: n,
          cols: n,
          init: this.init,
        });

        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            pattern.set(
              i,
              j,
              this.get((row + i) % inputHeight, (col + j) % inputWidth),
            );
          }
        }

        patterns.push(pattern);
      }
    }

    return patterns;
  }

  // return a slice of the grid starting at the given row and column
  slice(row: number, col: number, n: number): Grid<T | undefined> {
    const newSlice = new Grid<T>({
      rows: n,
      cols: n,
      init: undefined,
    });

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        newSlice.set(i, j, this.get(row + i, col + j));
      }
    }

    return newSlice;
  }
}
