import { readFile, writeFile } from "node:fs/promises";

const configPath = new URL("../dist/server/wrangler.json", import.meta.url);
const config = JSON.parse(await readFile(configPath, "utf8"));

delete config.compatibility_flags;
config.compatibility_date = "2026-08-04";

await writeFile(configPath, JSON.stringify(config));
