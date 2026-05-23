import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const nextConfig = require("eslint-config-next");
const nextTypeScriptConfig = require("eslint-config-next/typescript");

const config = [...nextConfig, ...nextTypeScriptConfig];

export default config;
