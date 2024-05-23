import { FileRouter } from './core/routing.ts';
import { FileSystem } from './core/fs.ts';
import { handle } from './build/server/entry.mjs';

Deno.serve(async (request: Request): Promise<Response> => {
  const response = await handle(request) as Response;
  if (response.ok) {
    console.log(`Response OK`)
    return response;
  }
  const client_path = Deno.realPathSync(`${import.meta.dirname || Deno.cwd()}/build/client`);
  const router = new FileRouter(
    new FileSystem(
      client_path
    ),
  );
  console.log(client_path)
  return router.handle(request);
});
