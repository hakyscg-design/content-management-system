import { rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const nextDirectory = join(root, "apps", "operator-console", ".next");

await rm(nextDirectory, { force: true, recursive: true });
