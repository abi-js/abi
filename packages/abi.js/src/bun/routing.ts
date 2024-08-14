import { BaseActionRouter, BaseFileRouter } from '../base/routing';

export class FileRouter extends BaseFileRouter {
  handle(request: Request): Response {
    const url = new URL(request.url);
    const pathname = decodeURIComponent(url.pathname);

    if (this.fs.exists(pathname)) {
      const path = this.fs.fullpath(pathname);
      if (path.isFile) {
        const file = Bun.file(path.realname);
        console.log(`Serve static file ${path.realname}`);
        return new Response(file.readable, {
          headers: {
            'Content-Type': file.type,
          },
        });
      }
    }

    return new Response(`File ${pathname} not found`, {
      status: 404,
    });
  }
}

export class ActionRouter extends BaseActionRouter {
  handle(request: Request): Response {
    const url = new URL(request.url);
    const pathname = decodeURIComponent(url.pathname);
    const action = this.find(request.method, pathname);
    if (action) {
      console.log(`Handle action ${pathname}`);
      return action.resolve(request);
    }

    return new Response(`Action ${pathname} not found`, {
      status: 404,
    });
  }
}
