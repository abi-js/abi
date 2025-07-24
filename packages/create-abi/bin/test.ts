import { assert } from "@japa/assert";
import { configure, processCLIArgs, run } from "@japa/runner";
import { TestContext } from "@japa/runner/core";
import { PathTester } from "create-abi/tester";

declare module "@japa/runner/core" {
	interface TestContext {
		path(path: string): PathTester;
	}
}

TestContext.macro("path", (path: string) => new PathTester(path));

processCLIArgs(process.argv.splice(2));

configure({
	files: ["tests/**/*.spec.ts"],
	plugins: [assert()],
});

run();
