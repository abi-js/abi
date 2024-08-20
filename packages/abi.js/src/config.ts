import { cwd } from './utils';

export type UserConfig = Partial<Config> | undefined;

export type Config = {
  rootDirectory: string;
  routerFile: string;
  assetsFolder: string;
  routesFolder: string;
  errorsFolder: string;
};

export const defaultConfig: Config = {
  rootDirectory: cwd,
  routerFile: 'router.ts',
  assetsFolder: 'assets',
  routesFolder: 'routes',
  errorsFolder: 'errors',
} as const;

export function defineConfig(config: UserConfig): Config {
  return config
    ? {
        ...defaultConfig,
        ...config,
      }
    : defaultConfig;
}
