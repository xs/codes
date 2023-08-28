import React from "react";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";

interface AspectRatioVideoProps {
  className?: string;
  src: string;
  ratio: number;
}

const AspectRatioVideo = ({ className, src, ratio }: AspectRatioVideoProps) => (
  <AspectRatio.Root className={className} ratio={ratio}>
    <video
      autoPlay
      muted
      loop
      disablePictureInPicture
      className="object-cover w-full h-full"
      src={src}
    />
  </AspectRatio.Root>
);

export default AspectRatioVideo;
