"use server";

import fs from "fs";
import path from "path";
import { read } from "to-vfile";

export type Shader = {
  fragmentShader: string;
  vertexShader?: string;
  id: string;
  name: string;
};

export type Uniforms = {
  [key: string]: any;
};

export type ShaderIndex = {
  byId: {
    [key: string]: Shader;
  };
  byName: {
    [key: string]: Shader;
  };
};

const shadersDir = path.join(process.cwd(), "src/shaders");

async function makeShader(filename: string): Promise<Shader> {
  const fragmentPath = path.join(shadersDir, filename, "fragment.frag");
  const fragmentShader = await read(fragmentPath, "utf-8");
  // set the id to the first three digits of the folder name
  // e.g. 000-yves-klein/ -> 000

  return {
    id: filename.slice(0, 3),
    name: filename.slice(4),
    fragmentShader: String(fragmentShader),
  };
}

export async function fetchShaderIndex(): Promise<ShaderIndex> {
  let shaderFilenames = fs.readdirSync(shadersDir);

  const index: ShaderIndex = {
    byId: {},
    byName: {},
  };

  for (const filename of shaderFilenames) {
    const shader = await makeShader(filename);
    index.byId[shader.id] = shader;
    index.byName[shader.name] = shader;
  }

  return index;
}
