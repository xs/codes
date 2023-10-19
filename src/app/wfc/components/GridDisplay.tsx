import { Grid } from "../lib/Grid";

interface GridDisplayProps<T> {
  grid: Grid<T>;
  pixelSize: number;
  colorMap: { [key: number]: [string, number] };
  opacity?: number;
}

const GridDisplay: React.FC<GridDisplayProps<number | undefined>> = ({
  grid,
  pixelSize,
  colorMap,
  opacity = 100,
}) => {
  const className = (pixel: number | undefined): string => {
    let hue = "gray";
    let shade = 300;
    let hoverShade = 600;

    if (pixel !== undefined) {
      const color = colorMap[pixel];
      if (color === undefined) {
        console.warn(
          "color not found for pixel: ",
          pixel,
          "defaulting to gray",
        );
      } else {
        [hue, shade] = color;
        hoverShade = shade + 100;
      }
    }

    return `w-${pixelSize} h-${pixelSize} bg-${hue}-${shade} hover:bg-${hue}-${hoverShade} opacity-${opacity}`;
  };

  return (
    <div>
      {Array.from({ length: grid.height() }, (_, row) => (
        <div key={row} className="flex">
          {Array.from({ length: grid.width() }, (_, col) => {
            return <div key={col} className={className(grid.get(row, col))} />;
          })}
        </div>
      ))}
    </div>
  );
};

export default GridDisplay;
