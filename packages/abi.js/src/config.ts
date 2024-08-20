import { cwd } from './utils';

export type UserConfig = Partial<Config> | undefined;

export type Config = {
  root: string;
  assets: string;
  routes: string;
  errors: string;
};

export const defaultConfig: Config = {
  root: cwd,
  assets: 'assets',
  routes: 'routes',
  errors: 'errors',
} as const;

export function defineConfig(config: UserConfig): Config {
  return config
    ? {
        ...defaultConfig,
        ...config,
      }
    : defaultConfig;
}
