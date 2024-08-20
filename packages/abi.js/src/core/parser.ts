export function parse_val(val: string): any {
  if (typeof val !== 'string') {
    return val;
  }

  val = val.trim();
  const lc_val = val.toLowerCase();
  if (lc_val === 'null') {
    return null;
  }
  if (lc_val === 'undefined') {
    return undefined;
  }
  if (lc_val === 'true') {
    return true;
  }
  if (lc_val === 'false') {
    return false;
  }
  if (!Number.isNaN(Number(val))) {
    return Number(val);
  }
  if (/^('|")(.*?)\1$/gms.test(val)) {
    return parse_str(val);
  }
  if (/^\[(.*?)\]$/gms.test(val)) {
    return parse_arr(val);
  }
  if (/^\{(.*?)\}$/gms.test(val)) {
    return parse_obj(val);
  }
  return val;
}

export function parse_str(val: string): string {
  val = val.trim();
  const res = /^('|")(.*?)\1$/gms.exec(val);
  if (res) {
    val = res[2];
  }
  return val;
}

export function parse_arr(val: string): any[] {
  const res = /^\[(.*?)\]$/gms.exec(val);
  if (res) {
    val = res[1];
  }
  const arr: any[] = [];
  const items = val.split(',');
  for (const i in items) {
    arr[i] = parse_val(items[i]);
  }
  return arr;
}

export function parse_obj(val: string): Record<any, any> {
  const res = /^\{(.*?)\}$/gms.exec(val);
  if (res) {
    val = res[1];
  }
  const obj: Record<any, any> = {};
  const items = val.split(',');
  for (const item of items) {
    const [key, val] = parse_prop(item);
    obj[key] = val;
  }
  return obj;
}

export function parse_params(val: string): Record<string, any> {
  const res = /^\((.*?)\)$/gms.exec(val);
  if (res) {
    val = res[1];
  }
  const params: Record<string, any> = {};
  const items = val.split(',');
  for (const item of items) {
    let [name, val] = parse_param(item);
    if (val !== undefined) {
      val = parse_val(val);
    }
    params[name] = val;
  }
  return params;
}

export function parse_args(val: string): Record<string, any> {
  const res = /^\((.*?)\)$/gms.exec(val);
  if (res) {
    val = res[1];
  }
  const args: Record<any, any> = {};
  const items = val.split(',');
  for (const item of items) {
    const [key, val] = parse_prop(item);
    args[key] = val;
  }
  return args;
}

export function parse_props(val: string): Record<string, any> {
  const res = /^\{(.*?)\}$/gms.exec(val);
  if (res) {
    val = res[1];
  }
  return parse_args(val);
}

export function parse_prop(val: string): any {
  if (/^([a-zA-Z0-9_\$]*)\s*\:\s*(.+)$/gms.test(val)) {
    return parse_arg(val);
  }
  return parse_param(val);
}

export function parse_arg(val: string): any {
  val = val.trim();
  const res = /^([a-zA-Z0-9_\$]*)\s*\:\s*(.+)$/gms.exec(val);
  if (res) {
    const key = parse_val(res[1]);
    let value = parse_val(res[2]);
    if (value !== undefined) {
      value = parse_val(value);
    }
    if (typeof value === 'string') {
      const [_, param] = parse_param(value);
      return [key, param ?? value];
    }
    if (value === undefined) {
      return parse_param(key);
    }
    return [key, value];
  }
  return parse_param(val);
}

export function parse_param(val: string): any {
  val = val.trim();
  const res = /^([a-zA-Z0-9_\$]+[a-zA-Z0-9_\$]*)\s*\=\s*(.+)$/gms.exec(val);
  if (res) {
    return [parse_str(res[1]), parse_val(res[2])];
  }
  return [parse_val(val)];
}
