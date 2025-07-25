import fs from "node:fs";
import path from "node:path";
import { copySync, ensureDirSync, pathExistsSync } from "fs-extra/esm";
import { $ } from "panam/executor";
import pm from "panam/pm";
import pkg from "../package.json";
import { ensureString } from "./console";
import { type Definition as BaseDefinition, Program } from "./core";
import {
	__dirname,
	clearDir,
	getJson,
	getJsonPath,
	notEmptyDir,
	replaceJsonRunCommand,
	resolveAbsoluteDir,
	resolveRelativeDir,
	safeCopy,
	sanitizePackageName,
	updatePackageName,
} from "./utils";

export type Definition = BaseDefinition & {
	destination: string;
	runtime: Runtime;
	force?: boolean;
	install?: boolean;
	git?: boolean;
	dryRun?: boolean;
};

export type EnsureRequired<T, K extends keyof T> = Omit<T, K> &
	Required<Pick<T, K>>;
export type UserDefinition = Partial<Definition>;

export const defaultDefinition = {
	destination: "./abi-app",
	runtime: "node",
	force: undefined,
	install: undefined,
	git: undefined,
	yes: undefined,
	no: undefined,
	dryRun: undefined,
} as const;

export type Runtime = "node" | "deno" | "bun";

export type Input = Required<Omit<Definition, "yes" | "no">> & {
	outDir: string;
	packageName: string;
};

export function defineDefinition(definition: UserDefinition): Definition {
	return { ...defaultDefinition, ...definition };
}

export class Application extends Program<Definition, Input> {
	configure(): void {
		this.strict()
			.interactive()
			.alias("h", "help")
			.useYes()
			.useNo()
			.command(
				"* [destination] [runtime]",
				"Create a new project powered by Abi.js",
			)
			.argument("destination", {
				type: "string",
				default: defaultDefinition.destination,
				desc: "Directory of the project",
			})
			.argument("runtime", {
				type: "string",
				default: defaultDefinition.runtime,
				desc: "JavaScript/TypeScript runtime to use",
				choices: ["node", "deno", "bun"],
			})
			.option("force", {
				alias: "f",
				type: "boolean",
				default: defaultDefinition.force,
				desc: "Overwrite target directory if it exists",
			})
			.option("install", {
				alias: "i",
				type: "boolean",
				default: defaultDefinition.install,
				desc: "Install dependencies",
			})
			.option("git", {
				type: "boolean",
				default: defaultDefinition.git,
				desc: "Use Git to save changes",
			})
			.option("dryRun", {
				type: "boolean",
				desc: "Walk through steps without executing",
			})
			.example("npm create abi@latest", "Create a project with default options")
			.example(
				"npm create abi@latest ./abi-app",
				"Create a project in a specific directory",
			)
			.example(
				"npm create abi@latest ./abi-app node",
				"Create a project using a server runtime",
			)
			.example(
				"npm create abi@latest ./abi-app node --it",
				"Create a project in interactive command mode",
			)
			.usage("npm create abi [destination] [runtime] [...options]");
	}

	parse(args: string[]): Definition {
		return defineDefinition(super.parse(args));
	}

	validate(definition: Definition): Input {
		return {
			destination: definition.destination,
			runtime: definition.runtime,
			force: definition.force ?? (!!definition.yes && !definition.no),
			install: definition.install ?? (!!definition.yes && !definition.no),
			git: definition.git ?? (!!definition.yes && !definition.no),
			dryRun: !!definition.dryRun,
			outDir: resolveAbsoluteDir(definition.destination),
			packageName: sanitizePackageName(definition.destination),
		};
	}

	async interact(definition: Definition): Promise<Input> {
		const destination =
			definition.destination === defaultDefinition.destination
				? await this.scanString(
						`Where would you like to create your new project? ${this.gray(
							`(Use './' for current directory)`,
						)}`,
						definition.destination,
					)
				: definition.destination;

		const outDir = resolveAbsoluteDir(destination.trim());
		const exists = notEmptyDir(outDir);

		const force =
			definition.force === undefined
				? exists &&
					!!(await this.scanBoolean(
						definition,
						`Directory "./${resolveRelativeDir(
							outDir,
						)}" already exists and is not empty. Would you like to force the copy?`,
						false,
					))
				: definition.force;

		let runtime: Runtime;

		if (definition.runtime === defaultDefinition.runtime) {
			const runtimeInput =
				((await this.scanBoolean(
					definition,
					"Would you like to use another runtime instead of Node.js?",
					false,
				)) &&
					(await this.scanChoice(
						"Which runtime do you prefer?",
						[
							{
								value: "node",
								label: "Node",
							},
							{
								value: "deno",
								label: "Deno",
							},
							{
								value: "bun",
								label: "Bun",
							},
						],
						definition.runtime,
					))) ||
				"node";

			ensureString(runtimeInput, (v): v is Runtime =>
				["node", "deno", "bun"].includes(v),
			);

			runtime = runtimeInput;
		} else {
			runtime = definition.runtime;
		}

		const install = !!(definition.install === undefined
			? await this.scanBoolean(
					definition,
					`Would you like to install ${pm.name} dependencies?`,
				)
			: definition.install);

		const git = !!(definition.git === undefined
			? await this.scanBoolean(
					definition,
					!exists || force
						? "Would you like to initialize Git?"
						: "Would you like to save the changes with Git?",
				)
			: definition.git);

		const dryRun = !!definition.dryRun;

		let jsonFile = "";

		if (exists && force) {
			if (fs.existsSync(getJsonPath("deno", outDir))) {
				jsonFile = "deno";
			} else if (fs.existsSync(getJsonPath("package", outDir))) {
				jsonFile = "package";
			}
		}

		let packageName =
			jsonFile !== ""
				? getJson(jsonFile, outDir).name
				: sanitizePackageName(destination);

		packageName = definition.yes
			? packageName
			: await this.scanString(
					"What should be the name of this package?",
					packageName,
				);

		return {
			destination,
			runtime,
			install,
			git,
			force,
			outDir,
			packageName,
			dryRun,
		};
	}

	async execute(input: Input): Promise<number> {
		try {
			const ranInstall = await this.start(input);
			this.updatePackageJson(input);
			await this.runGit(input);
			this.end(input, ranInstall);
			return 0;
		} catch (err) {
			console.error("An error occurred during Abi.js project creation:", err);
			return 1;
		}
	}

	async prepareDir(input: Input) {
		const outDir = input.outDir;

		if (notEmptyDir(outDir)) {
			if (input.force) {
				if (!input.dryRun) {
					await clearDir(outDir);
				}
				this.info(`Directory "${outDir}" successfully emptied 🔥`);
			} else {
				this.error(`Directory "${outDir}" already exists.`);
				this.info(
					`Please either remove this directory, choose another location or run the command again with '--force | -f' flag.`,
				);
				this.cancel();
				process.exit(1);
			}
		}
	}

	async runCreate(input: Input) {
		await this.prepareDir(input);
		this.copyStarter(input);
	}

	async start(input: Input): Promise<boolean> {
		this.intro(`Let's create a ${this.bgYellow(" Abi.js")} App ✨`);

		await this.runCreate(input);
		return this.runInstall(input);
	}

	end(input: Input, ranInstall: boolean): void {
		const outDir = input.outDir;
		const isCwdDir = process.cwd() === outDir;
		const relativeProjectPath = resolveRelativeDir(outDir);
		const outString = [];

		if (isCwdDir) {
			outString.push(`🦄 ${this.bgMagenta(" Success! ")}`);
		} else {
			outString.push(
				`🦄 ${this.bgMagenta(" Success! ")} ${this.cyan(
					"Project created in",
				)} ${this.bold(this.magenta(relativeProjectPath))} ${this.cyan("directory")}`,
			);
		}
		outString.push("");

		outString.push(`🐰 ${this.cyan("Next steps:")}`);
		if (!isCwdDir) {
			outString.push(`   cd ${relativeProjectPath}`);
		}
		if (!ranInstall) {
			outString.push(`   ${pm.name} install`);
		}
		outString.push(`   ${pm.name} start`);

		this.note(outString.join("\n"), "Ready to start 🚀");

		this.outro("Happy coding! 💻🎉");
	}

	updatePackageJson(input: Input): void {
		const { outDir, packageName } = input;
		const jsonFile = input.runtime === "deno" ? "deno" : "package";

		updatePackageName(packageName as string, jsonFile, outDir);
		this.info(`Updated package name to "${packageName}" 📦️`);

		if (!pm.isNpm()) {
			this.info(
				`Replacing 'npm run' by '${pm.runCommand()}' in package.json...`,
			);
			replaceJsonRunCommand(jsonFile, outDir);
		}
	}

	async runInstall(input: Input): Promise<boolean> {
		let ranInstall = false;

		if (input.install) {
			this.step("Installing dependencies...");

			if (!input.dryRun) {
				await pm.install({ cwd: input.outDir });
			}

			ranInstall = true;
		}

		return ranInstall;
	}

	async runGit(input: Input): Promise<void> {
		if (input.git) {
			const s = this.spinner();

			const outDir = input.outDir;
			const initialized = fs.existsSync(path.join(outDir, ".git"));
			if (initialized) {
				this.info("Git has already been initialized before.");
			}

			s.start("Initializing Git...");

			if (!input.dryRun) {
				const res = [];
				try {
					if (!initialized) {
						res.push(await $("git", ["init"], { cwd: outDir }).result);
					}
					res.push(await $("git", ["add", "-A"], { cwd: outDir }).result);
					res.push(
						await $("git", ["commit", "-m", "Initial commit 🎉"], {
							cwd: outDir,
						}).result,
					);

					if (res.some((r) => r.status === false)) {
						throw "";
					}

					s.stop("Git initialized 🎲");
				} catch (_e) {
					s.stop("Git failed to initialize");
					if (!initialized) {
						this.error(
							"Git failed to initialize. You can do this manually by running: git init",
						);
					} else {
						this.error(
							"Git failed to add new changes. You can do this manually by running: git add -A && git commit",
						);
					}
				}
			}
		}
	}

	copyShared(input: Input) {
		for (const filename of ["gitignore" /* 'README.md'*/]) {
			let outfile = filename;

			if (filename === "gitignore") {
				outfile = ".gitignore";
			}
			const outpath = path.join(input.outDir, outfile);
			const exists = pathExistsSync(outpath);
			if (filename.startsWith(".") && filename.endsWith("ignore")) {
				this.step(
					`${exists ? "Merging" : "Copying"} \`${outfile}\` file... 🙈`,
				);
			}

			if (!input.dryRun) {
				const origin = path.join(__dirname, "..", "starters", filename);
				safeCopy(origin, outpath);
			}
		}
	}

	copyStarter(input: Input, templatePath?: string): void {
		this.step(
			`Creating new project in ${this.bgBlue(` ${input.outDir} `)} ... 🐇`,
		);

		if (!input.dryRun) {
			const outDir = input.outDir;
			try {
				ensureDirSync(outDir);

				if (!templatePath) {
					templatePath = path.join(__dirname, "..", "starters", input.runtime);
				}

				copySync(templatePath, outDir);

				this.copyShared(input);
			} catch (error) {
				this.error(this.red(`Template copy failed: ${error}`));
			}
		}
	}
}

export function app(name = pkg.name, version = pkg.version): Application {
	return new Application(name, version);
}

export default app();
