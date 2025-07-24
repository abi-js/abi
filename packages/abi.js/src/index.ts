import { Application, app } from "./app";
import { defaultConfig, type UserConfig } from "./config";

export { Application as Abi, app as abi, type UserConfig as AbiConfig };

const _app: Application = app(defaultConfig);

export default _app;
