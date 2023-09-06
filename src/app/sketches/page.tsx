import { Box } from "@radix-ui/themes";

import Gallery from "@/components/shaders/Gallery";
import { Shader, fetchShaderIndex } from "@/utils/shaders";

export default async function Page() {
  const shaderIndex = await fetchShaderIndex();

  const yvesShader = shaderIndex["000-yves-klein"];
  const albersShader = shaderIndex["001-josef-albers"];
  const shaders: Shader[] = [yvesShader, albersShader, yvesShader];

  return (
    <Box className="h-screen">
      <Gallery shaders={shaders} />
    </Box>
  );
}
