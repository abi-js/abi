import { defaultConfig } from './defaults';
import type { Config, UserConfig } from './types';

export { defaultConfig };
export type { Config, UserConfig };

export function defineConfig(config: UserConfig): Config {
  return config
    ? {
        ...defaultConfig,
        ...config,
      }
    : defaultConfig;
}
