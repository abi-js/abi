import { test } from '@japa/runner';
import type { TestContext } from '@japa/runner/core';
import { run } from 'create-abi';
import { emptyDirSync, ensureDirSync } from 'fs-extra';
import pm from 'panam';

process.env.NODE_ENV = 'test';
process.env.CI = '1';

const integration = 'abi';
const root = 'labs';
const project = 'test-app';

delete process.env.npm_config_user_agent;

const setup = () => {
  ensureDirSync(root);

  return () => emptyDirSync(root);
};

const generatedDirs = [];

const generatedFiles = [
  '.gitignore',
];

type GeneratedOptions = Partial<{
  runtime: 'node' | 'deno' | 'bun';
  install: boolean;
  git: boolean;
}>;

const getGeneratedFiles = (options: GeneratedOptions = {}): string[] => {
  const files = generatedFiles;

  switch(options.runtime) {
    case 'deno':
      files.push('deno.json', 'server.ts');
      break;

    case 'bun':
      files.push('bun.lock', 'package.json', 'server.ts', 'tsconfig.json');
      break;

    default: files.push('package-lock.json', 'package.json', 'server.js');
  }

  return files;
};

const getGeneratedDirs = (options: GeneratedOptions = {}): string[] => {
  const dirs = generatedDirs;

  return dirs;
};

test.group(`create ${integration} app`, (group) => {
  group.each.setup(setup);

  test('without runtime', async (context) => {
    return testRun([], context);
  });

  test('with Node.js runtime', async (context) => {
    return testRun(['node'], context, {
      runtime: 'node',
    });
  });

  test('with Deno runtime', async (context) => {
    return testRun(['deno'], context, {
      runtime: 'deno',
    });
  });

  test('with Bun runtime', async (context) => {
    return testRun(['bun'], context, {
      runtime: 'bun',
    });
  });
});

test.group(`create ${integration} with yes and no options`, (group) => {
  group.setup(setup);

  test('--no option', async (context) => {
    return testRun(['--no'], context);
  });

  test('--yes option', async (context) => {
    return testRun(['--yes'], context, {
      // install: true,
      git: true,
    });
  }).disableTimeout();
});

async function testRun(
  args: string[],
  context: TestContext,
  options: GeneratedOptions = {},
): Promise<void> {
  const { assert } = context;
  const destination = `${root}/${project}`;

  const result = await run([pm.name, 'create', `${destination}`, ...args]);
  assert.equal(result, 0);

  testProject(destination, context, options);
}

function testProject(
  project: string,
  context: TestContext,
  options: GeneratedOptions = {},
): void {
  const { assert, path } = context;
  const testProject = path(project);

  assert.isTrue(testProject.exists());
  assert.isTrue(testProject.isDir());

  testProjectDirs(project, context, options);
  testProjectFiles(project, context, options);
}

function testProjectDirs(
  project: string,
  { assert, path }: TestContext,
  options: GeneratedOptions = {},
): void {
  for (const dir of getGeneratedDirs(options)) {
    const testDir = path(`${project}/${dir}`);
    assert.isTrue(testDir.exists());
    assert.isTrue(testDir.isDir());
  }
}

function testProjectFiles(
  project: string,
  { assert, path }: TestContext,
  options: GeneratedOptions = {},
): void {
  for (const file of getGeneratedFiles(options)) {
    const testFile = path(`${project}/${file}`);
    console.log(`${project}/${file} with options`, options);
    assert.isTrue(testFile.exists());
    assert.isTrue(testFile.isFile());
  }
}
