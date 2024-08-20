import 'buno.js';

export class Application {}

export function app(): Application {
  return new Application();
}

export { Application as Abi, app as abi };

const _app = app();

export default _app;
