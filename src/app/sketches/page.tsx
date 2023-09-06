import { Box } from "@radix-ui/themes";

import Piece from "@/components/Piece";
import { fetchShaderIndex } from "@/utils/shaders";

export default async function Page() {
  const shaderIndex = await fetchShaderIndex();

  const yvesShader = shaderIndex["000-yves-klein"];

  return (
    <Box className="h-screen">
      <Piece fragmentShader={yvesShader.fragmentShader} />
    </Box>
  );
}
