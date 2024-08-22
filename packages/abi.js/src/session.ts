import {
  deflateSync,
  deserialize,
  fileExists,
  inflateSync,
  readFile,
  serialize,
  writeFile,
} from './utils';

export type SessionData = Record<string, any>;

export class SessionHandler {
  constructor(
    readonly path = `${import.meta.dirname}/.sessions`,
    readonly prefix = 'session_',
  ) {}

  read(id: string): SessionData {
    const file = this.getPath(id);
    const raw = fileExists(file) ? readFile(file) : '';
    const data = deflateSync(raw.toString());
    return deserialize(data);
  }

  getPath(id: string): string {
    return `${this.path}/${this.prefix}-${id}`;
  }

  write(id: string, data: SessionData) {
    const raw = inflateSync(serialize(data)).toString();
    writeFile(this.getPath(id), raw);
  }
}

export class Session {
  readonly id: string;
  public data?: SessionData;

  constructor(
    protected handler: SessionHandler,
    id?: string,
  ) {
    this.id = id ?? crypto.randomUUID();
  }

  load() {
    this.data = this.handler.read(this.id) || {};
  }

  set<T>(key: string, value: T): this {
    if (!this.data) {
      this.data = {};
    }
    this.data[key] = value;
    return this;
  }

  get<T>(key: string, defaultValue?: T): T | null | undefined {
    return this.data && this.data[key] !== undefined
      ? (this.data[key] satisfies T)
      : defaultValue;
  }

  has(key: string): boolean {
    return this.data ? this.data[key] !== undefined : false;
  }

  remove(key: string): this {
    if (this.data) {
      delete this.data[key];
    }
    return this;
  }

  save(): void {
    if (this.data) {
      this.handler.write(this.id, this.data);
    }
  }
}
