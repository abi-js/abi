import { expect, it } from 'bun:test';
import { Session, SessionData, SessionHandler } from './session';

it('should be an instance of Session', async () => {
  const handler = new SessionHandler(`${import.meta.dir}/.sess`, 'sess_');
  const session = new Session(handler);

  await session.load();

  expect(session.set('sikessem', 'Sikessem')).toBeInstanceOf(Session);
  expect(session.has('sikessem')).toBeTrue();
  expect(session.get('sikessem')!).toStrictEqual('Sikessem');

  session.save();

  await session.load();

  expect(session.has('sikessem')).toBeTrue();
  expect(session.get('sikessem')!).toStrictEqual('Sikessem');
});
