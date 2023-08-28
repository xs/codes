import React from "react";

interface AspectRatioVideoProps {
  src: string;
}

const AspectRatioVideo = ({ src }: AspectRatioVideoProps) => (
  <video
    autoPlay
    muted
    loop
    disablePictureInPicture
    className="object-cover w-full h-full"
    src={src}
  />
);

export default AspectRatioVideo;
