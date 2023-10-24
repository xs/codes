import { Grid } from "../lib/Grid";

interface GridDisplayProps<T> {
  grid: Grid<T>;
  pixelSize: number;
  colorMap: string[];
  opacity?: number;
  onClick?: (row: number, col: number) => void;
}

const GridDisplay: React.FC<GridDisplayProps<number | undefined>> = ({
  grid,
  pixelSize,
  colorMap,
  onClick = () => {},
  opacity = 100,
}) => {
  const className = (pixel: number | undefined): string => {
    let colorClasses = "bg-gray-300 hover:bg-gray-400";

    if (pixel !== undefined) {
      const color = colorMap[pixel];
      if (color === undefined) {
        console.warn(
          "color not found for pixel: ",
          pixel,
          "defaulting to gray",
        );
      } else {
        colorClasses = color;
      }
    }

    return `w-${pixelSize} h-${pixelSize} ${colorClasses} opacity-${opacity}`;
  };

  return (
    <div>
      {Array.from({ length: grid.height() }, (_, row) => (
        <div key={row} className="flex">
          {Array.from({ length: grid.width() }, (_, col) => {
            return (
              <div
                key={col}
                className={className(grid.get(row, col))}
                onClick={() => {
                  onClick(row, col);
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GridDisplay;
