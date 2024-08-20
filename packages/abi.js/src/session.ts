import { deserialize, serialize } from 'bun:jsc';

export type SessionData = Record<string, any>;

export class SessionHandler {
  constructor(
    readonly path = `${import.meta.dir}/.sessions`,
    readonly prefix = 'session_',
  ) {}

  async read(id: string): Promise<SessionData> {
    const file = Bun.file(this.getPath(id));
    const raw = (await file.exists()) ? await file.text() : '';
    console.log(raw);
    const data = Bun.deflateSync(raw);
    console.log(data);
    return deserialize(data);
  }

  getPath(id: string): string {
    return `${this.path}/${this.prefix}-${id}`;
  }

  write(id: string, data: SessionData) {
    const raw = Bun.inflateSync(
      serialize(data, { binaryType: 'nodebuffer' }),
    ).toString();
    console.log('Data', raw.toString());
    Bun.write(this.getPath(id), raw);
  }
}

export class Session {
  readonly id: string;
  public data: SessionData;

  constructor(
    protected handler: SessionHandler,
    id?: string,
  ) {
    this.id = id ?? crypto.randomUUID();
  }

  async load() {
    this.data = (await this.handler.read(this.id)) || {};
  }

  set<T>(key: string, value: T): this {
    this.data[key] = value;
    return this;
  }

  get<T>(key: string, defaultValue?: T): T | null | undefined {
    return this.data[key] !== undefined
      ? (this.data[key] satisfies T)
      : defaultValue;
  }

  has(key: string): boolean {
    return this.data[key] !== undefined;
  }

  remove(key: string): this {
    delete this.data[key];
    return this;
  }

  save(): void {
    this.handler.write(this.id, this.data);
  }
}
