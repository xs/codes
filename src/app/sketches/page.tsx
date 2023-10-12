import { Box } from "@radix-ui/themes";

import Gallery from "@/app/sketches/Gallery";
import { fetchShaderIndex } from "@/utils/shaders";

export default async function Page() {
  const shaderIndex = await fetchShaderIndex();

  const yvesShader = shaderIndex.byName["yves-klein"];
  const albersShader = shaderIndex.byName["josef-albers"];
  const neesShader = shaderIndex.byName["georg-nees"];

  return (
    <Box className="h-screen">
      <Gallery shaders={[yvesShader, albersShader, neesShader]} />
    </Box>
  );
}
