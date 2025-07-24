import type { Engine } from "./types";

export const engine: Engine = "V8";

export { deserialize, serialize } from "node:v8";
export { deflateSync, inflateSync } from "node:zlib";
