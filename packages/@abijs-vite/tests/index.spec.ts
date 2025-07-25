import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { afterEach, describe, expect, it, vi } from "vitest";
import v from "../src";

vi.mock("fs", async () => {
	const actual = await vi.importActual<typeof import("fs")>("fs");

	return {
		default: {
			...actual,
			existsSync: (path: string) =>
				["src/resources/", "src/templates/"].includes(path) ||
				actual.existsSync(path),
		},
	};
});

const normalizePath = (path: string): string => {
	return process.platform === "win32" ? path.replaceAll("/", "\\") : path;
};

describe("v-vite", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("handles missing configuration", () => {
		/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
		/* @ts-ignore */
		expect(() => v()).toThrowError("v-vite: missing configuration.");

		/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
		/* @ts-ignore */
		expect(() => v({})).toThrowError(
			'v-vite: missing configuration for "input".',
		);
	});

	it("accepts a single input", () => {
		const plugin = v("src/resources/app.ts")[0];

		const config = plugin.config({}, { command: "build", mode: "production" });
		expect(config.build.rollupOptions.input).toBe("src/resources/app.ts");

		const ssrConfig = plugin.config(
			{ build: { ssr: true } },
			{ command: "build", mode: "production" },
		);
		expect(ssrConfig.build.rollupOptions.input).toBe("src/resources/app.ts");
	});

	it("accepts an array of inputs", () => {
		const plugin = v(["src/resources/app.ts", "src/resources/other.js"])[0];

		const config = plugin.config({}, { command: "build", mode: "production" });
		expect(config.build.rollupOptions.input).toEqual([
			"src/resources/app.ts",
			"src/resources/other.js",
		]);

		const ssrConfig = plugin.config(
			{ build: { ssr: true } },
			{ command: "build", mode: "production" },
		);
		expect(ssrConfig.build.rollupOptions.input).toEqual([
			"src/resources/app.ts",
			"src/resources/other.js",
		]);
	});

	it("accepts a full configuration", () => {
		const plugin = v({
			input: "src/resources/app.ts",
			publicDirectory: "other-public",
			buildDirectory: "other-build",
			ssr: "src/resources/ssr.ts",
			ssrOutputDirectory: "other-ssr-output",
		})[0];

		const config = plugin.config({}, { command: "build", mode: "production" });
		expect(config.base).toBe("/other-build/");
		expect(config.build.manifest).toBe("manifest.json");
		expect(config.build.outDir).toBe(normalizePath("other-public/other-build"));
		expect(config.build.rollupOptions.input).toBe("src/resources/app.ts");

		const ssrConfig = plugin.config(
			{ build: { ssr: true } },
			{ command: "build", mode: "production" },
		);
		expect(ssrConfig.base).toBe("/other-build/");
		expect(ssrConfig.build.manifest).toBe(false);
		expect(ssrConfig.build.outDir).toBe("other-ssr-output");
		expect(ssrConfig.build.rollupOptions.input).toBe("src/resources/ssr.ts");
	});

	it("accepts a single input within a full configuration", () => {
		const plugin = v({
			input: "src/resources/app.ts",
			ssr: "src/resources/ssr.ts",
		})[0];

		const config = plugin.config({}, { command: "build", mode: "production" });
		expect(config.build.rollupOptions.input).toBe("src/resources/app.ts");

		const ssrConfig = plugin.config(
			{ build: { ssr: true } },
			{ command: "build", mode: "production" },
		);
		expect(ssrConfig.build.rollupOptions.input).toBe("src/resources/ssr.ts");
	});

	it("accepts an array of inputs within a full configuration", () => {
		const plugin = v({
			input: ["src/resources/app.ts", "src/resources/other.js"],
			ssr: ["src/resources/ssr.ts", "src/resources/other.js"],
		})[0];

		const config = plugin.config({}, { command: "build", mode: "production" });
		expect(config.build.rollupOptions.input).toEqual([
			"src/resources/app.ts",
			"src/resources/other.js",
		]);

		const ssrConfig = plugin.config(
			{ build: { ssr: true } },
			{ command: "build", mode: "production" },
		);
		expect(ssrConfig.build.rollupOptions.input).toEqual([
			"src/resources/ssr.ts",
			"src/resources/other.js",
		]);
	});

	it("accepts an input object within a full configuration", () => {
		const plugin = v({
			input: { app: "src/resources/entrypoint-browser.js" },
			ssr: { ssr: "src/resources/entrypoint-ssr.js" },
		})[0];

		const config = plugin.config({}, { command: "build", mode: "production" });
		expect(config.build.rollupOptions.input).toEqual({
			app: "src/resources/entrypoint-browser.js",
		});

		const ssrConfig = plugin.config(
			{ build: { ssr: true } },
			{ command: "build", mode: "production" },
		);
		expect(ssrConfig.build.rollupOptions.input).toEqual({
			ssr: "src/resources/entrypoint-ssr.js",
		});
	});

	it("respects the users build.manifest config option", () => {
		const plugin = v({
			input: "src/resources/app.js",
		})[0];

		const userConfig = { build: { manifest: "my-custom-manifest.json" } };

		const config = plugin.config(userConfig, {
			command: "build",
			mode: "production",
		});

		expect(config.build.manifest).toBe("my-custom-manifest.json");
	});

	it("has a default manifest path", () => {
		const plugin = v({
			input: "src/resources/app.js",
		})[0];

		const userConfig = {};

		const config = plugin.config(userConfig, {
			command: "build",
			mode: "production",
		});

		expect(config.build.manifest).toBe("manifest.json");
	});

	it("respects users base config option", () => {
		const plugin = v({
			input: "src/resources/app.ts",
		})[0];

		const userConfig = { base: "/foo/" };

		const config = plugin.config(userConfig, {
			command: "build",
			mode: "production",
		});

		expect(config.base).toBe("/foo/");
	});

	it("accepts a partial configuration", () => {
		const plugin = v({
			input: "src/resources/app.js",
			ssr: "src/resources/ssr.js",
		})[0];

		const config = plugin.config({}, { command: "build", mode: "production" });
		expect(config.base).toBe("/build/");
		expect(config.build.manifest).toBe("manifest.json");
		expect(config.build.outDir).toBe(normalizePath("public/build"));
		expect(config.build.rollupOptions.input).toBe("src/resources/app.js");

		const ssrConfig = plugin.config(
			{ build: { ssr: true } },
			{ command: "build", mode: "production" },
		);
		expect(ssrConfig.base).toBe("/build/");
		expect(ssrConfig.build.manifest).toBe(false);
		expect(ssrConfig.build.outDir).toBe("ssr");
		expect(ssrConfig.build.rollupOptions.input).toBe("src/resources/ssr.js");
	});

	it("uses the default entry point when ssr entry point is not provided", () => {
		// This is support users who may want a dedicated Vite config for SSR.
		const plugin = v("src/resources/ssr.js")[0];

		const ssrConfig = plugin.config(
			{ build: { ssr: true } },
			{ command: "build", mode: "production" },
		);
		expect(ssrConfig.build.rollupOptions.input).toBe("src/resources/ssr.js");
	});

	it("prefixes the base with ASSET_URL in production mode", () => {
		process.env.ASSET_URL = "http://example.com";
		const plugin = v("src/resources/app.js")[0];

		const devConfig = plugin.config(
			{},
			{ command: "serve", mode: "development" },
		);
		expect(devConfig.base).toBe("");

		const prodConfig = plugin.config(
			{},
			{ command: "build", mode: "production" },
		);
		expect(prodConfig.base).toBe("http://example.com/build/");

		delete process.env.ASSET_URL;
	});

	it("prevents setting an empty publicDirectory", () => {
		expect(
			() => v({ input: "src/resources/app.js", publicDirectory: "" })[0],
		).toThrowError("publicDirectory must be a subdirectory");
	});

	it("prevents setting an empty buildDirectory", () => {
		expect(
			() => v({ input: "src/resources/app.js", buildDirectory: "" })[0],
		).toThrowError("buildDirectory must be a subdirectory");
	});

	it("handles surrounding slashes on directories", () => {
		const plugin = v({
			input: "src/resources/app.js",
			publicDirectory: "/public/test/",
			buildDirectory: "/build/test/",
			ssrOutputDirectory: "/ssr-output/test/",
		})[0];

		const config = plugin.config({}, { command: "build", mode: "production" });
		expect(config.base).toBe("/build/test/");
		expect(config.build.outDir).toBe(normalizePath("public/test/build/test"));

		const ssrConfig = plugin.config(
			{ build: { ssr: true } },
			{ command: "build", mode: "production" },
		);
		expect(ssrConfig.build.outDir).toBe("ssr-output/test");
	});

	it("provides an @ alias by default", () => {
		const plugin = v("src/resources/app.js")[0];

		const config = plugin.config({}, { command: "build", mode: "development" });

		expect(config.resolve.alias["@"]).toBe("/src/resources");
	});

	it("respects a users existing @ alias", () => {
		const plugin = v("src/resources/app.js")[0];

		const config = plugin.config(
			{
				resolve: {
					alias: {
						"@": "/somewhere/else",
					},
				},
			},
			{ command: "build", mode: "development" },
		);

		expect(config.resolve.alias["@"]).toBe("/somewhere/else");
	});

	it("appends an Alias object when using an alias array", () => {
		const plugin = v("src/resources/app.js")[0];

		const config = plugin.config(
			{
				resolve: {
					alias: [{ find: "@", replacement: "/something/else" }],
				},
			},
			{ command: "build", mode: "development" },
		);

		expect(config.resolve.alias).toEqual([
			{ find: "@", replacement: "/something/else" },
			{ find: "@", replacement: "/src/resources" },
		]);
	});

	it("prevents the Inertia helpers from being externalized", () => {
		/* eslint-disable @typescript-eslint/ban-ts-comment */
		const plugin = v("src/resources/app.js")[0];

		const noSsrConfig = plugin.config(
			{ build: { ssr: true } },
			{ command: "build", mode: "production" },
		);
		/* @ts-ignore */
		expect(noSsrConfig.ssr.noExternal).toEqual(["v-vite"]);

		/* @ts-ignore */
		const nothingExternalConfig = plugin.config(
			{ ssr: { noExternal: true }, build: { ssr: true } },
			{ command: "build", mode: "production" },
		);
		/* @ts-ignore */
		expect(nothingExternalConfig.ssr.noExternal).toBe(true);

		/* @ts-ignore */
		const arrayNoExternalConfig = plugin.config(
			{ ssr: { noExternal: ["foo"] }, build: { ssr: true } },
			{ command: "build", mode: "production" },
		);
		/* @ts-ignore */
		expect(arrayNoExternalConfig.ssr.noExternal).toEqual(["foo", "v-vite"]);

		/* @ts-ignore */
		const stringNoExternalConfig = plugin.config(
			{ ssr: { noExternal: "foo" }, build: { ssr: true } },
			{ command: "build", mode: "production" },
		);
		/* @ts-ignore */
		expect(stringNoExternalConfig.ssr.noExternal).toEqual(["foo", "v-vite"]);
	});

	it("does not configure full reload when configuration it not an object", () => {
		const plugins = v("src/resources/app.js");

		expect(plugins.length).toBe(1);
	});

	it("does not configure full reload when refresh is not present", () => {
		const plugins = v({
			input: "src/resources/app.js",
		});

		expect(plugins.length).toBe(1);
	});

	it("does not configure full reload when refresh is set to undefined", () => {
		const plugins = v({
			input: "src/resources/app.js",
			refresh: undefined,
		});
		expect(plugins.length).toBe(1);
	});

	it("does not configure full reload when refresh is false", () => {
		const plugins = v({
			input: "src/resources/app.js",
			refresh: false,
		});

		expect(plugins.length).toBe(1);
	});

	it("configures full reload with routes and views when refresh is true", () => {
		const plugins = v({
			input: "src/resources/app.js",
			refresh: true,
		});

		expect(plugins.length).toBe(2);
		/** @ts-ignore */
		expect(plugins[1].__v_plugin_config).toEqual({
			paths: ["src/resources/**", "src/templates/**"],
		});
	});

	it("configures full reload when refresh is a single path", () => {
		const plugins = v({
			input: "src/resources/app.js",
			refresh: "path/to/watch/**",
		});

		expect(plugins.length).toBe(2);
		/** @ts-ignore */
		expect(plugins[1].__v_plugin_config).toEqual({
			paths: ["path/to/watch/**"],
		});
	});

	it("configures full reload when refresh is an array of paths", () => {
		const plugins = v({
			input: "src/resources/app.js",
			refresh: ["path/to/watch/**", "another/to/watch/**"],
		});

		expect(plugins.length).toBe(2);
		/** @ts-ignore */
		expect(plugins[1].__v_plugin_config).toEqual({
			paths: ["path/to/watch/**", "another/to/watch/**"],
		});
	});

	it("configures full reload when refresh is a complete configuration to proxy", () => {
		const plugins = v({
			input: "src/resources/app.js",
			refresh: {
				paths: ["path/to/watch/**", "another/to/watch/**"],
				config: { delay: 987 },
			},
		});

		expect(plugins.length).toBe(2);
		/** @ts-ignore */
		expect(plugins[1].__v_plugin_config).toEqual({
			paths: ["path/to/watch/**", "another/to/watch/**"],
			config: { delay: 987 },
		});
	});

	it("configures full reload when refresh is an array of complete configurations to proxy", () => {
		const plugins = v({
			input: "src/resources/app.js",
			refresh: [
				{
					paths: ["path/to/watch/**"],
					config: { delay: 987 },
				},
				{
					paths: ["another/to/watch/**"],
					config: { delay: 123 },
				},
			],
		});

		expect(plugins.length).toBe(3);
		/** @ts-ignore */
		expect(plugins[1].__v_plugin_config).toEqual({
			paths: ["path/to/watch/**"],
			config: { delay: 987 },
		});
		/** @ts-ignore */
		expect(plugins[2].__v_plugin_config).toEqual({
			paths: ["another/to/watch/**"],
			config: { delay: 123 },
		});
	});

	it("configures default cors.origin values", () => {
		const test = (pattern: RegExp | string, value: string) =>
			pattern instanceof RegExp ? pattern.test(value) : pattern === value;
		fs.writeFileSync(
			path.join(__dirname, ".env"),
			"APP_URL=http://example.com",
		);

		const plugins = v({
			input: "src/resources/app.js",
		});
		const resolvedConfig = plugins[0].config(
			{ envDir: __dirname },
			{
				mode: "",
				command: "serve",
			},
		);

		// Allowed origins...
		expect(
			[
				// localhost
				"http://localhost",
				"https://localhost",
				"http://localhost:8080",
				"https://localhost:8080",
				// 127.0.0.1
				"http://127.0.0.1",
				"https://127.0.0.1",
				"http://127.0.0.1:8000",
				"https://127.0.0.1:8000",
				// *.test
				"http://v.test",
				"https://v.test",
				"http://v.test:8000",
				"https://v.test:8000",
				"http://my-app.test",
				"https://my-app.test",
				"http://my-app.test:8000",
				"https://my-app.test:8000",
				"https://my-app.test:8",
				// APP_URL
				"http://example.com",
				"https://subdomain.my-app.test",
			].some((url) =>
				resolvedConfig.server.cors.origin.some((regex) => test(regex, url)),
			),
		).toBe(true);
		// Disallowed origins...
		expect(
			[
				"http://v.com",
				"https://v.com",
				"http://v.com:8000",
				"https://v.com:8000",
				"http://128.0.0.1",
				"https://128.0.0.1",
				"http://128.0.0.1:8000",
				"https://128.0.0.1:8000",
				"https://example.com",
				"http://example.com:8000",
				"https://example.com:8000",
				"http://exampletest",
				"http://example.test:",
			].some((url) =>
				resolvedConfig.server.cors.origin.some((regex) => test(regex, url)),
			),
		).toBe(false);

		fs.rmSync(path.join(__dirname, ".env"));
	});

	it("respects the user's server.cors config", () => {
		const plugins = v({
			input: "src/resources/app.js",
		});
		const resolvedConfig = plugins[0].config(
			{
				envDir: __dirname,
				server: {
					cors: true,
				},
			},
			{
				mode: "",
				command: "serve",
			},
		);

		expect(resolvedConfig.server.cors).toBe(true);
	});
});
