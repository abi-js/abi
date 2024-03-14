import { parse_params } from "./parser";

export function reflect<T extends Function | object>(
  value: T,
  objectThis?: object,
): ReflectionObject | ReflectionFunction {
  return typeof value === "object"
    ? new ReflectionObject(value, objectThis)
    : new ReflectionFunction(value, objectThis);
}

export class ReflectionError extends Error {}

export abstract class Reflection<T extends unknown> {
  constructor(readonly value: T) {}

  toString(): string {
    return String(this.value);
  }
}

export class ReflectionObject extends Reflection<object> {
  constructor(
    value: object,
    protected objectThis?: object,
  ) {
    super(value);
  }

  override toString(): string {
    return String(this.value.constructor);
  }
}

export class ReflectionFunction extends Reflection<Function> {
  protected is_arrow = false;
  protected name: string;
  readonly parameters: ReflectionParameter<any>[] = [];
  constructor(
    value: Function,
    protected objectThis?: object,
  ) {
    super(value);
    const str_val = value.toString();
    const arrow_re = /^\(([^\(\)]*?)\)\s*\=\>\s*(.+)$/gms;
    const named_re =
      /^(?:function\s+)?([a-zA-Z$_]+[a-zA-Z0-9$_]*)\s*\(([^\(\)]*?)\)\s*\{(.*)\}$/gms;
    const arrow_res = arrow_re.exec(str_val);
    const named_res = named_re.exec(str_val);
    if (arrow_res) {
      this.is_arrow = true;
      this.name = "";
      this.#parseParameters(arrow_res[1]);
      this.#parseReturn(arrow_res[2]);
    } else if (named_res) {
      this.is_arrow = false;
      this.name = named_res[1] || "anonymous";
      this.#parseParameters(named_res[2]);
      this.#parseReturn(named_res[3]);
    } else {
      throw new ReflectionError(`${value} is not a function`);
    }
  }

  #parseParameters(str_params: string) {
    const default_params = parse_params(str_params);
    const entries = Object.entries(default_params);
    if (
      entries.length === 1 &&
      entries[0][0] === "0" &&
      entries[0][1] === undefined
    ) {
      return;
    }

    const i = 0;
    for (const param of entries) {
      this.parameters.push(
        new ReflectionParameter(this, param[0], i, param[1]),
      );
    }
  }

  getParameter<T extends unknown>(
    name: string,
  ): ReflectionParameter<T> | undefined {
    for (const param of this.parameters) {
      if (param.name === name) {
        return param;
      }
    }
    return undefined;
  }

  hasParameter(name: string): boolean {
    for (const param of this.parameters) {
      if (param.name === name) {
        return true;
      }
    }
    return false;
  }

  #parseReturn(_str_ret: string) {
    // TODO: throw new ReflectionError("Not implemented!");
  }
}

export class ReflectionParameter<T> extends Reflection<T> {
  constructor(
    readonly func: ReflectionFunction,
    readonly name: string,
    readonly index: number,
    value: T,
  ) {
    super(value);
  }

  getFunction(): ReflectionFunction {
    return this.func;
  }

  hasDefaultValue(): boolean {
    return this.value !== undefined;
  }

  getDefaultValue(): ReflectionParameterValue<T> {
    return new ReflectionParameterValue<T>(this, this.value);
  }
}

export class ReflectionValue<T extends unknown> extends Reflection<T> {
  get type(): string {
    return typeof this.value;
  }
}

export class ReflectionParameterValue<
  T extends unknown,
> extends ReflectionValue<T> {
  constructor(
    protected param: ReflectionParameter<T>,
    value: T,
  ) {
    super(value);
  }

  getParameter(): ReflectionParameter<T> {
    return this.param;
  }
}

export class ReflectionReturnValue<T> extends ReflectionValue<T> {
  constructor(
    protected func: ReflectionFunction,
    value: T,
  ) {
    super(value);
  }

  getFunction(): ReflectionFunction {
    return this.func;
  }
}

export type Context = Record<string, any>;

export class Container {
  constructor(protected context: Context) {}

  call<T>(callback: Function, context: Context = {}): T {
    return callback(...this.getArgs(callback, context));
  }

  getArgs(callback: Function, context: Context = {}): any[] {
    const reflection = reflect(callback);
    const args: any[] = [];

    for (const param of (reflection as ReflectionFunction).parameters) {
      args.push(this.get(param.name, param.value, context));
    }

    return args;
  }

  get<T extends unknown | undefined>(
    id: string,
    defaultValue?: T,
    context: Context = {},
  ): T {
    context = this.mergeContext(context);
    return this.make(context[id] || defaultValue, context);
  }

  make<T>(value: T, context: Context = {}): T {
    return typeof value === "function" ? this.call(value, context) : value;
  }

  mergeContext(context: Context): Context {
    return {
      ...context,
      ...this.context,
    };
  }
}

export default function (context: Context) {
  return new Container(context);
}
