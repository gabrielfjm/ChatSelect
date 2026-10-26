// On Windows, a terminal opened as "c:\..." (lowercase drive, as VS Code
// sometimes does) makes Vitest load its runner twice — once per drive-letter
// spelling — and every suite fails with "Cannot read properties of undefined
// (reading 'config')". Normalizing the drive letter before Vitest loads keeps
// a single module instance. Arguments are forwarded to the Vitest CLI.
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const cwd = process.cwd().replace(/^[a-z]:/, (drive) => drive.toUpperCase());
process.chdir(cwd);

await import(pathToFileURL(join(cwd, "node_modules/vitest/vitest.mjs")).href);
