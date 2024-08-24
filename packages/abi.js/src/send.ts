import { createReadStream } from 'node:fs';
import type { Readable } from 'node:stream';
import { get_extension_type } from './mime';
import { fileExists, joinPath, pathinfo } from './runtime';

export function sendFile(
  file: string,
  request: Request,
  index = 'index.html',
): Response {
  if (!fileExists(file)) {
    return new Response('404 Not Found', { status: 404 });
  }

  const info = pathinfo(file);
  let path: string;

  if (info.isDirectory) {
    path = joinPath(info.realname, index);
    if (!fileExists(path)) {
      return new Response('404 Not Found', { status: 404 });
    }
  } else {
    path = info.realname;
  }

  const { extension, size, mtime } = info;
  const mimeType =
    get_extension_type(extension.toLowerCase()) || 'application/octet-stream';

  const range = request.headers.get('Range');
  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
    const start = Number.parseInt(startStr, 10);
    const end = endStr ? Number.parseInt(endStr, 10) : size - 1;

    if (start >= size || end >= size) {
      return new Response(null, {
        status: 416,
        headers: new Headers({
          'Content-Range': `bytes */${size}`,
        }),
      });
    }

    const stream = createReadStream(path, { start, end });
    return new Response(streamToReadable(stream), {
      status: 206,
      headers: new Headers({
        'Content-Range': `bytes ${start}-${end}/${size}`.toString(),
        'Accept-Ranges': 'bytes',
        'Content-Length': (end - start + 1).toString(),
        'Content-Type': mimeType,
      }),
    });
  }

  const stream = createReadStream(path);
  return new Response(streamToReadable(stream), {
    status: 200,
    headers: new Headers({
      'Content-Type': mimeType,
      'Content-Length': size.toString(),
      'Last-Modified': mtime?.toUTCString() || new Date().toUTCString(),
      'Cache-Control': 'public, max-age=31536000',
    }),
  });
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
