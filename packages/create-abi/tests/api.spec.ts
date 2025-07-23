import { test } from '@japa/runner';
import app, { defaultDefinition } from 'create-abi/app';
import { name, version } from 'create-abi/package.json';
import { ProgramTester } from 'create-abi/tester';

process.env.NODE_ENV = 'test';
process.env.CI = '1';

const tester = new ProgramTester(app);
const projectName = 'my-abi-app';

enum input {
  which_destination = 0,
  use_runtime = 1,
  which_runtime = 2,
  force = 6,
  install = 9,
  git = 11,
  package_name = 12,
}

const questions = {
  [input.which_destination]: 'Where would you like to create your new project?',
  [input.use_runtime]: 'Would you like to use another runtime instead of .*?',
  [input.which_runtime]: 'Which runtime do you prefer?',
  [input.force]: 'Would you like to force the copy?',
  [input.install]: 'Would you like to install .* dependencies?',
  [input.git]: 'Would you like to initialize Git?',
  [input.package_name]: 'What should be the name of this package?',
} as const;

const answers = {
  [input.which_destination]: ['.', projectName],
  [input.use_runtime]: [true, false],
  [input.which_runtime]: ['node', 'deno', 'bun'],
  [input.force]: [true, false],
  [input.install]: [true, false],
  [input.git]: [true, false],
  [input.package_name]: [projectName, ''],
} as const;

test.group(`${name}@${version} API`, () => {
  test('constructor', ({ assert }) => {
    assert.equal(app.name, name);
    assert.equal(app.version, version);
  });
});

test.group('default definition', () => {
  const definition = tester.parse([]);

  test('keys', ({ assert }) => {
    assert.isTrue(
      definition.has(
        'destination',
        'runtime',
        'force',
        'install',
        'git',
      ),
    );
  });

  test('destination', ({ assert }) => {
    assert.isTrue(definition.get('destination').isString());
    assert.isTrue(definition.get('destination').equals('./abi-app'));
    assert.isTrue(
      definition.get('destination').equals(defaultDefinition.destination),
    );
  });

  test('runtime', ({ assert }) => {
    assert.isTrue(definition.get('runtime').isString());
    assert.isTrue(definition.get('runtime').equals('node'));
    assert.isTrue(definition.get('runtime').equals(defaultDefinition.runtime));
  });

  test('force', ({ assert }) => {
    assert.isTrue(definition.get('force').isUndefined());
    assert.isTrue(definition.get('force').equals(defaultDefinition.force));
  });

  test('install', ({ assert }) => {
    assert.isTrue(definition.get('install').isUndefined());
    assert.isTrue(definition.get('install').equals(defaultDefinition.install));
  });

  test('git', ({ assert }) => {
    assert.isTrue(definition.get('git').isUndefined());
    assert.isTrue(definition.get('git').equals(defaultDefinition.git));
  });
});

test.group('arguments', () => {
  test('no argument', ({ assert }) => {
    const definition = tester.parse([]);

    assert.isTrue(definition.get('destination').isString());
    assert.isTrue(definition.get('destination').equals('./abi-app'));
    assert.isTrue(definition.get('runtime').equals('node'));
  });

  test('one argument', ({ assert }) => {
    const definition = tester.parse([projectName]);
    assert.isTrue(definition.get('destination').isString());
    assert.isTrue(definition.get('destination').equals(projectName));
    assert.isTrue(definition.get('runtime').equals('node'));
  });

  test('two arguments', ({ assert }) => {
    let definition = tester.parse([projectName, 'node']);
    assert.isTrue(definition.get('destination').equals(projectName));
    assert.isTrue(definition.get('runtime').isString());
    assert.isTrue(definition.get('runtime').equals('node'));

    definition = tester.parse(['my-abi-app', 'deno']);
    assert.isTrue(definition.get('runtime').isString());
    assert.isTrue(definition.get('runtime').equals('deno'));
  });
});

test.group('options', () => {
  test('yes', ({ assert }) => {
    let definition = tester.parse(['--yes']);
    assert.isTrue(definition.get('yes').isBoolean());
    assert.isTrue(definition.get('yes').isTrue());
    assert.isTrue(definition.get('y').isBoolean());
    assert.isTrue(definition.get('y').isTrue());

    definition = tester.parse(['--no-yes']);
    assert.isTrue(definition.get('yes').isBoolean());
    assert.isTrue(definition.get('yes').isFalse());
    assert.isTrue(definition.get('y').isBoolean());
    assert.isTrue(definition.get('y').isFalse());
  });

  test('no', ({ assert }) => {
    let definition = tester.parse(['--no']);
    assert.isTrue(definition.get('no').isBoolean());
    assert.isTrue(definition.get('no').isTrue());
    assert.isTrue(definition.get('n').isBoolean());
    assert.isTrue(definition.get('n').isTrue());

    definition = tester.parse(['--no-no']);
    assert.isTrue(definition.get('no').isBoolean());
    assert.isTrue(definition.get('no').isFalse());
    assert.isTrue(definition.get('n').isBoolean());
    assert.isTrue(definition.get('n').isFalse());
  });

  test('force', ({ assert }) => {
    let definition = tester.parse(['--force']);
    assert.isTrue(definition.get('force').isBoolean());
    assert.isTrue(definition.get('force').isTrue());
    assert.isTrue(definition.get('f').isBoolean());
    assert.isTrue(definition.get('f').isTrue());

    definition = tester.parse(['--no-force']);
    assert.isTrue(definition.get('force').isBoolean());
    assert.isTrue(definition.get('force').isFalse());
    assert.isTrue(definition.get('f').isBoolean());
    assert.isTrue(definition.get('f').isFalse());
  });

  test('install', ({ assert }) => {
    let definition = tester.parse(['--install']);
    assert.isTrue(definition.get('install').isBoolean());
    assert.isTrue(definition.get('install').isTrue());
    assert.isTrue(definition.get('i').isBoolean());
    assert.isTrue(definition.get('i').isTrue());

    definition = tester.parse(['--no-install']);
    assert.isTrue(definition.get('install').isBoolean());
    assert.isTrue(definition.get('install').isFalse());
    assert.isTrue(definition.get('i').isBoolean());
    assert.isTrue(definition.get('i').isFalse());
  });

  test('git', ({ assert }) => {
    let definition = tester.parse(['--git']);
    assert.isTrue(definition.get('git').isBoolean());
    assert.isTrue(definition.get('git').isTrue());

    definition = tester.parse(['--no-git']);
    assert.isTrue(definition.get('git').isBoolean());
    assert.isTrue(definition.get('git').isFalse());
  });
});

test.group('aliases', () => {
  test('y', ({ assert }) => {
    let definition = tester.parse(['-y']);
    assert.isTrue(definition.get('yes').isBoolean());
    assert.isTrue(definition.get('yes').isTrue());
    assert.isTrue(definition.get('y').isBoolean());
    assert.isTrue(definition.get('y').isTrue());

    definition = tester.parse(['--no-y']);
    assert.isTrue(definition.get('yes').isBoolean());
    assert.isTrue(definition.get('yes').isFalse());
    assert.isTrue(definition.get('y').isBoolean());
    assert.isTrue(definition.get('y').isFalse());
  });

  test('n', ({ assert }) => {
    let definition = tester.parse(['-n']);
    assert.isTrue(definition.get('no').isBoolean());
    assert.isTrue(definition.get('no').isTrue());
    assert.isTrue(definition.get('n').isBoolean());
    assert.isTrue(definition.get('n').isTrue());

    definition = tester.parse(['--no-n']);
    assert.isTrue(definition.get('no').isBoolean());
    assert.isTrue(definition.get('no').isFalse());
    assert.isTrue(definition.get('n').isBoolean());
    assert.isTrue(definition.get('n').isFalse());
  });

  test('f', ({ assert }) => {
    let definition = tester.parse(['-f']);
    assert.isTrue(definition.get('force').isBoolean());
    assert.isTrue(definition.get('force').isTrue());
    assert.isTrue(definition.get('f').isBoolean());
    assert.isTrue(definition.get('f').isTrue());

    definition = tester.parse(['--no-f']);
    assert.isTrue(definition.get('force').isBoolean());
    assert.isTrue(definition.get('force').isFalse());
    assert.isTrue(definition.get('f').isBoolean());
    assert.isTrue(definition.get('f').isFalse());
  });

  test('i', ({ assert }) => {
    let definition = tester.parse(['-i']);
    assert.isTrue(definition.get('install').isBoolean());
    assert.isTrue(definition.get('install').isTrue());
    assert.isTrue(definition.get('i').isBoolean());
    assert.isTrue(definition.get('i').isTrue());

    definition = tester.parse(['--no-i']);
    assert.isTrue(definition.get('install').isBoolean());
    assert.isTrue(definition.get('install').isFalse());
    assert.isTrue(definition.get('i').isBoolean());
    assert.isTrue(definition.get('i').isFalse());
  });
});

for (const [key, choices] of Object.entries(answers)) {
  const index = Number(key);
  const question = questions[index];

  test.group(`${question}`, () => {
    for (const answer of choices) {
      test(`${answer}`, async ({ assert }) => {
        tester.intercept(question, answer);
        const parsed = tester.parse(
          index === input.which_destination ? [] : [projectName],
        );
        const definition = await tester.interact(parsed.definition);
        switch (index) {
          case input.which_destination:
            assert.isTrue(definition.get('destination').equals(answer));
            break;

          case input.which_runtime:
            if (
              (
                await tester.scanBoolean(
                  parsed.definition,
                  questions[input.use_runtime],
                )
              ).isTrue()
            ) {
              assert.isTrue(definition.get('runtime').equals(answer));
            }
            break;

          case input.install:
            assert.isTrue(definition.get('install').equals(answer));
            break;

          case input.git:
            assert.isTrue(definition.get('git').equals(answer));
            break;
        }
      });
    }
  });
}
