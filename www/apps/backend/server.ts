import { Abi } from 'abi.js';

const abi = new Abi()

  .handle('../frontend/dist/')
  .get('/', () => 'Welcome to my homepage')
  .get(
    '/users(/:user<number>=5)?/profile',
    (request: Request, user = 5) => `${request.method} User ${user}`,
  );

export default abi;
