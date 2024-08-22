import { fs, path } from 'buno.js';

const directoryPath = path.resolve(import.meta.dir, '..', 'dist', 'deno');

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    throw err;
  }

  for (const file of files) {
    const filePath = path.join(directoryPath, file);

    if (filePath.match(/\.(?:node|bun)\.c?ts$/)) {
      fs.rmSync(filePath);
      console.log('\x1b[32m', `🗑️  ${filePath} removed`);
      continue;
    }

    if (file.endsWith('.ts')) {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          throw err;
        }

        const result = data.replace(/node:node:/g, 'node:');

        fs.writeFile(filePath, result, 'utf8', (err) => {
          if (err) {
            throw err;
          }
          console.log('\x1b[32m', `✏️  ${filePath} fixed`);
        });
      });
    }
  }
});
