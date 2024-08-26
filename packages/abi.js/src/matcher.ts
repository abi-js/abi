import type { Options, Parameter } from './types';

export function match(subject: string, pattern: string): Options | false {
  const _subject = normalize(subject);
  let _pattern = normalize(pattern);

  if (_pattern === _subject) {
    return {};
  }

  const params: Parameter[] = [];

  const re =
    /\:([a-z]+)(?:\s*\<\s*(num(?:ber)|str(?:ing))\s*\>)?(?:\s*\=\s*(\w+))?/;
  _pattern = _pattern.replace('(', '(?:');
  while (re.test(_pattern)) {
    const m = re.exec(_pattern)!;
    const search = m[0];
    const type = m[2] in ['number', 'num'] ? 'number' : 'string';
    const value = type === 'number' ? Number(m[3]) : m[3];
    const param: Parameter = {
      name: m[1],
      type,
      value,
    };
    params.push(param);
    const replace = `(${
      param.type === 'number' ? '[0-9]+' : '[^\\/\\[\\]]+'
    })${value === undefined ? '' : '?'}`;
    _pattern = _pattern.replace(search, replace);
  }

  _pattern = _pattern.replace('/', '\\/');
  _pattern = `^${_pattern}$`;

  const matches = _subject.match(_pattern);
  const options: Options = {};

  if (matches) {
    let i = 0;
    for (const param of params) {
      let value = matches[i + 1] || param.value;
      if (param.type === 'number') {
        value = Number(value);
      }
      options[i++] = value;
      options[param.name] = value;
    }
    return options;
  }

  return false;
}

function normalize(subject: string): string {
  let _subject = subject.trim();
  if (_subject.startsWith('/')) {
    _subject = _subject.substring(1);
  }
  if (_subject.endsWith('/')) {
    _subject = _subject.substring(0, _subject.length - 1);
  }
  return _subject;
}
