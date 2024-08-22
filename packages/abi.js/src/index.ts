import { Application, app } from './app';
import { type UserConfig, defaultConfig } from './config';

export { Application as Abi, app as abi, type UserConfig as AbiConfig };

const _app: Application = app(defaultConfig);

export default _app;
