# Create [abi](https://github.com/abi-js) 🦾

## **The Ultimate Starter for Abi.js Projects**

Seamlessly scaffold content-driven web projects with the power of [Abi.js](https://github.com/abi-js).
Whether you're building blazing-fast blogs, portfolios, or scalable applications,
this CLI has you covered.

## Quickstart 🎉

To create a brand new project,
you can use the following command:

  ```bash
  npm create abi@latest
  ```

---

## 🚀 **Installation & Usage**

### 🧑‍💻 Usage

Run the following command using your preferred package manager:

- **With `NPM`**:

  ```bash
  npm create abi@latest [destination] [runtime] [...options]
  ```

- **With `Yarn`**:

  ```bash
  yarn create abi [destination] [runtime] [...options]
  ```

- **With `PNPM`**:

  ```bash
  pnpm create abi [destination] [runtime] [...options]
  ```

- **With `Bun`**:

  ```bash
  bun create abi [destination] [runtime] [...options]
  ```

### 🛠️ Flags

#### Arguments

  Customize the command with the following arguments:

  | Name        | Type                       | Default value    | Description                       |
  | :-----------| :--------------------------| :----------------| :---------------------------------|
  | destination | String                     | ./abi-app | Directory of the project.         |
  | runtime     | "node" or "deno" or "bun" | node             | JavaScript/TypeScript runtime to use.                   |

#### Options

  Enhance your project setup with these additional flags:

  | Name                         | Shortcut        | Description                                    |
  | :--------------------------- | :---------------| :----------------------------------------------|
  | `--help`                     | `-h`            | Display all available options.                 |
  | `--force` / `--no-force`     | `-f` / `--no-f` | Overwrite target directory, if needed.         |
  | `--install` / `--no-install` | `-i` / `--no-i` | Automatically install dependencies.            |
  | `--git` / `--no-git`         |                 | Use Git to save changes.                       |
  | `--yes`                      | `-y`            | Accept all default configurations.             |
  | `--no`                       | `-n`            | Decline all default configurations.            |
  | `--dry-run`                  |                 | Simulate the setup process without executing.  |

### 💡 Examples

The easiest way to explore [Abi.js](https://github.com/abi-js)
on your machine is by running the following command:

```bash
npm create abi@latest
```

You can combine multiple flags to set up your project exactly as needed:

```bash
npm create abi my-abi-project --yes --no-git --no-ci
```

### 📦 API

For developers looking to programmatically access the CLI functionality:

1. Basic Usage

    Run the CLI programmatically without arguments:

    ```typescript
    import createAbi from 'create-abi';

    createAbi();
    ```

2. With Custom Arguments

    Specify arguments directly:

    ```typescript
    import { run } from 'create-abi';

    run(["./abi-app", "node"]);
    ```

3. Definition Types

    Define the structure of the CLI options and arguments:

    ```typescript
    export type Definition = {
      destination: string;
      runtime?: "node" | "deno" | "bun";
      force?: boolean;
      install?: boolean;
      git?: boolean;
      yes?: boolean;
      no?: boolean;
      dryRun?: boolean;
    };
    ```

4. Default Settings

    Here are the default configurations:

    ```typescript
    export const defaultDefinition = {
      destination: "./abi-app",
      runtime: "node",
      force: undefined,
      install: undefined,
      git: undefined,
      yes: undefined,
      no: undefined,
      dryRun: undefined
    } as const;
    ```

## 🌐 Community

- [Ping @abidotjs](https://x.com/intent/follow?screen_name=abidotjs) on 𝕏
