import fs from "fs";
import path from "path";
import { read } from "to-vfile";
import { matter } from "vfile-matter";

export type Shader = {
  fragmentShader: string;
  uniforms: object;
  vertexShader?: string;
  id: string;
  slug: string;
};

export type ShaderIndex = {
  [key: string]: Shader;
};

const shadersDir = path.join(process.cwd(), "src/shaders");

async function makeShader(filename: string): Promise<Shader> {
  const filePath = path.join(shadersDir, filename);
  const file = await read(filePath, "utf-8");

  // set the id to the first three digits of the filename
  // e.g. 000-yves-klein.frag -> 000

  return {
    id: filename.slice(0, 3),
    slug: path.basename(filename, ".frag"),
    fragmentShader: String(file),
    uniforms: {},
  };
}

export async function fetchShaderIndex(): Promise<ShaderIndex> {
  let shaderFilenames = fs.readdirSync(shadersDir);

  const index: ShaderIndex = {};

  for (const filename of shaderFilenames) {
    const shader = await makeShader(filename);
    index[shader.slug] = shader;
  }

  return index;
}
