import { Abi } from 'jsr:@abi-js/abi';

const abi = new Abi()
  .get('', () => 'Welcome to Abi!')
  .handle('../frontend/dist/');

export default abi;
