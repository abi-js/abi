import { createReadStream } from 'node:fs';
import type { Readable } from 'node:stream';
import { Context } from './context';
import { extensionType } from './mimes';
import { fileExists, joinPath, pathinfo, readFile } from './runtime';

export function sendFile(
  file: string,
  request: Request,
  index?: string,
): Response {
  const context = new Context(request);

  if (!fileExists(file)) {
    return context.abort(404);
  }

  const { isDirectory, realname } = pathinfo(file);
  let path: string;

  if (isDirectory) {
    if (index) {
      path = joinPath(realname, index);
      if (!fileExists(path)) {
        return context.abort(404);
      }
    } else {
      return context.abort(403);
    }
  } else {
    path = realname;
  }

  const { extension, size, mtime } = pathinfo(path);
  const mimeType = extensionType(extension) || 'application/octet-stream';

  const range = request.headers.get('Range');
  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
    const start = Number.parseInt(startStr, 10);
    const end = endStr ? Number.parseInt(endStr, 10) : size - 1;

    if (start >= size || end >= size) {
      return context.respond(
        null,
        {
          'Content-Range': `bytes */${size}`,
        },
        416,
      );
    }

    const stream = createReadStream(path, { start, end });
    return context.respond(
      streamToReadable(stream),
      {
        'Content-Range': `bytes ${start}-${end}/${size}`.toString(),
        'Accept-Ranges': 'bytes',
        'Content-Length': (end - start + 1).toString(),
        'Content-Type': mimeType,
      },
      206,
    );
  }

  const data = readFile(path);
  return context.respond(
    data,
    {
      'Content-Type': mimeType,
      'Content-Length': size.toString(),
      'Last-Modified': mtime?.toUTCString() || new Date().toUTCString(),
      'Cache-Control': 'public, max-age=31536000',
    },
    200,
  );
}

function streamToReadable(stream: Readable): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      stream.on('data', (chunk) => controller.enqueue(new Uint8Array(chunk)));
      stream.on('end', () => controller.close());
      stream.on('error', (err) => controller.error(err));
    },
    cancel() {
      stream.destroy();
    },
  });
}
