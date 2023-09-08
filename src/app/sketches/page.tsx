import { Box } from "@radix-ui/themes";

import Gallery from "@/components/shaders/Gallery";
import { fetchShaderIndex } from "@/utils/shaders";

export default async function Page() {
  const shaderIndex = await fetchShaderIndex();

  const yvesShader = shaderIndex["000-yves-klein"];
  const albersShader = shaderIndex["001-josef-albers"];

  return (
    <Box className="h-screen">
      <Gallery shaders={[yvesShader, albersShader]} />
    </Box>
  );
}
