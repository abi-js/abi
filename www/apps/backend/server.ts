import { Abi } from 'abi.js';

const abi = new Abi({
  assets: '../frontend/dist/',
});

abi.onGet('/', () => 'Welcome to my homepage');
abi.onGet(
  '/users/[user:number=0]/profile',
  (request: Request, user = 5) => `${request.method} User ${user}`,
);

export default abi;
