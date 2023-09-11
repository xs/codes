import { Box } from "@radix-ui/themes";

import Gallery from "@/components/shaders/Gallery";
import { fetchShaderIndex } from "@/utils/shaders";

export default async function Page() {
  const shaderIndex = await fetchShaderIndex();

  const yvesShader = shaderIndex.byName["yves-klein"];
  const albersShader = shaderIndex.byName["josef-albers"];

  return (
    <Box className="h-screen">
      <Gallery shaders={[yvesShader, albersShader]} />
    </Box>
  );
}
