import { expect, test } from 'bun:test';
import reflex, {
  Reflection,
  ReflectionFunction,
  ReflectionObject,
  ReflectionParameter,
  reflect,
} from './container';

class Foo {
  public bar() {
    return 'baz';
  }
}

test('Reflex container', () => {
  const container = reflex({
    name: 'Sigui',
    username: 'siguici',
  });

  expect(
    container.call(
      (name: string, username: string) =>
        `I'm ${name} and my username is ${username}`,
    ),
  ).toEqual("I'm Sigui and my username is siguici");
});

test('Reflection function', () => {
  const arrow = (name = 'Sigui') => `Hello ${name}`;
  const named = function funct(name: string) {
    return `Hello ${name}`;
  };
  const class_method = Foo.bar;
  const object_method = new Foo().bar;
  const arrow_reflection = reflect(arrow);
  const named_reflection = reflect(named);
  const object_method_reflection = reflect(object_method);
  const arrow_param = arrow_reflection.getParameter('name');
  const named_param = named_reflection.getParameter('name');
  const arrow_param_value = arrow_param.getDefaultValue();
  const named_param_value = named_param.getDefaultValue();
  expect(arrow_reflection).toBeInstanceOf(Reflection);
  expect(named_reflection).toBeInstanceOf(Reflection);
  expect(object_method_reflection).toBeInstanceOf(ReflectionFunction);
  expect(arrow_reflection).toBeInstanceOf(ReflectionFunction);
  expect(named_reflection).toBeInstanceOf(ReflectionFunction);
  expect(arrow_param).toBeInstanceOf(ReflectionParameter);
  expect(named_param).toBeInstanceOf(ReflectionParameter);
  expect(arrow_param.value).toEqual('Sigui');
  expect(named_param.value).toEqual(undefined);
  expect(arrow_param_value.type).toEqual('string');
  expect(named_param_value.type).toEqual('undefined');
});

test('Reflection object', () => {
  const obj_reflection = reflect({});
  const cls_reflection = reflect(new (class {})());
  expect(obj_reflection).toBeInstanceOf(Reflection);
  expect(cls_reflection).toBeInstanceOf(Reflection);
  expect(obj_reflection).toBeInstanceOf(ReflectionObject);
  expect(cls_reflection).toBeInstanceOf(ReflectionObject);
});
