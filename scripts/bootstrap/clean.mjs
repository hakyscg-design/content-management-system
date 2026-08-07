import { rm } from "node:fs/promises";

const generatedPaths = ["dist", "coverage", ".vitest"];

for (const path of generatedPaths) {
  await rm(path, { force: true, recursive: true });
}

console.log("Removed BE-01 generated output directories when present.");
