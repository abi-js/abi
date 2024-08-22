import { parse_str } from './parser';

export type Locale = string;
export type Attrs = Record<string, string>;
export type Props = Record<string, any>;
export type EltName = string;
export type Translations = Record<Locale, string>;

export abstract class Node {
  abstract render(locale?: Locale): string;
}

export abstract class Tag extends Node {
  protected nodes: Node[] = [];

  constructor(
    readonly name: string,
    ...nodes: Node[]
  ) {
    super();
    this.addNodes(nodes);
  }

  addNodes(nodes: Node[]): this {
    for (const node of nodes) {
      this.addNode(node);
    }
    return this;
  }

  addNode(node: Node): this {
    this.nodes.push(node);
    return this;
  }

  getNodes(): Node[] {
    return this.nodes;
  }

  getTexts(): Text[] {
    const texts: Text[] = [];
    for (const node of this.nodes) {
      if (node instanceof Text) {
        texts.push(node);
      }
    }
    return texts;
  }

  getElements(): Element[] {
    const elements: Element[] = [];
    for (const node of this.nodes) {
      if (node instanceof Element) {
        elements.push(node);
      }
    }
    return elements;
  }

  abstract open(): string;

  abstract close(): string;

  get slot(): Slot {
    return new Slot(this.nodes);
  }

  get is_empty(): boolean {
    return this.slot.is_empty;
  }

  render(locale?: Locale): string {
    return this.open() + this.renderSlot(locale) + this.close();
  }

  renderSlot(locale?: Locale): string {
    return this.slot.render(locale);
  }
}

export class Component extends Tag {
  constructor(
    name: string,
    readonly props: Props,
    ...nodes: Node[]
  ) {
    super(name, ...nodes);
  }

  open(): string {
    return `<${this.name}${this.renderProps()}${this.slot.is_empty ? '' : '>'}`;
  }

  close(): string {
    return this.slot.is_empty ? '/>' : `</${this.name}>`;
  }

  renderProps(): string {
    let props = '';

    for (const prop of Object.entries(this.props)) {
      props += ` ${prop[0]}="${prop[1].toString()}"`;
    }

    return props;
  }
}

export class Element extends Tag {
  static readonly ORPHAN = [
    'area',
    'base',
    'basefont',
    'br',
    'col',
    'command',
    'embed',
    'frame',
    'hr',
    'img',
    'input',
    'isindex',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ];

  static readonly INLINE = [
    'a',
    'abbr',
    'acronym',
    'b',
    'bdi',
    'bdo',
    'big',
    'br',
    'cite',
    'code',
    'data',
    'del',
    'dfn',
    'em',
    'font',
    'i',
    'img',
    'ins',
    'kbd',
    'map',
    'mark',
    'object',
    'q',
    'rp',
    'rt',
    'rtc',
    'ruby',
    's',
    'samp',
    'small',
    'span',
    'strike',
    'strong',
    'sub',
    'sup',
    'time',
    'tt',
    'u',
    'var',
  ];

  constructor(
    name: EltName,
    readonly attrs: Attrs = {},
    ...nodes: Node[]
  ) {
    super(name, ...nodes);
  }

  renderAttrs(): string {
    let attrs = '';

    for (const attr of Object.entries(this.attrs)) {
      attrs += ` ${attr[0]}="${attr[1]}"`;
    }

    return attrs;
  }

  open(): string {
    return `<${this.name}${this.renderAttrs()}>`;
  }

  close(): string {
    return this.is_orphan ? '' : `</${this.name}>`;
  }

  get is_orphan(): boolean {
    return Element.ORPHAN.includes(this.name);
  }

  get is_paired(): boolean {
    return !this.is_orphan;
  }

  get is_inline(): boolean {
    return Element.INLINE.includes(this.name);
  }

  get is_block(): boolean {
    return !this.is_inline;
  }

  get is_custom(): boolean {
    return this.name.includes('-');
  }
}

export class Slot extends Node {
  constructor(readonly nodes: Node[]) {
    super();
  }

  get is_empty(): boolean {
    return this.nodes.length === 0;
  }

  render(locale?: string | undefined): string {
    let str = '';

    for (const node of this.nodes) {
      str += node.render(locale);
    }

    return str;
  }
}

export class Text extends Node {
  static locale: Locale = 'en_US';
  static dictionnary: Record<string, Translations> = {};

  constructor(
    public value: string,
    translations: Translations = {},
  ) {
    super();
    Text.setTranslations(value, translations);
  }

  static setTranslations(value: string, translations: Translations) {
    for (const translation of Object.entries(translations)) {
      Text.setTranslation(value, translation[0], translation[1]);
    }
  }

  static setTranslation(value: string, locale: Locale, translation: string) {
    if (Text.dictionnary[value] === undefined) {
      Text.dictionnary[value] = {};
    }
    Text.dictionnary[value][locale] = translation;
  }

  static getTranslation(value: string, locale: Locale): string | undefined {
    return Text.getTranslations(value)[locale];
  }

  static getTranslations(value: string): Translations {
    const translations = Text.dictionnary[value];

    if (!translations) {
      for (const [defaultValue, translations] of Object.entries(
        Text.dictionnary,
      )) {
        for (const translation of Object.values(translations)) {
          if (value === translation) {
            translations[Text.locale] = defaultValue;
            return translations;
          }
        }
      }
    }

    return translations;
  }

  static translate(value: string): Translate {
    const translations = Text.getTranslations(value);
    return Translate.from(translations);
  }

  translateTo(locale: Locale): string {
    return Text.getTranslation(this.value, locale) ?? this.value;
  }

  render(locale?: Locale): string {
    return locale ? this.translateTo(locale) : this.value;
  }
}

export class Translate {
  constructor(protected translations: Translations) {}

  static from(translations: Translations): Translate {
    return new Translate(translations);
  }

  to(locale: Locale): string | undefined {
    return this.translations[locale];
  }
}

export class Template {
  constructor(protected content: string | TemplateStringsArray) {}

  render(locale?: Locale): string {
    const content = this.content.toString();
    const ID = '[a-zA-Z]+[a-zA-Z0-9-_]*';
    const SINGLE_QUOTE_STR = "'(?:\\'|[^'])*'";
    const DOUBLE_QUOTE_STR = '"(?:\\"|[^"])*"';
    const STR = `${SINGLE_QUOTE_STR}|${DOUBLE_QUOTE_STR}`;
    const ATTR = `(${ID})\\s*=\\s*(${STR})\\s*`;
    const ATTRS = `${ATTR}(?:\\s*${ATTR})*`;
    const ATTRS_BLOCK = `\\[(${ATTRS})\\]`;
    const ELT = `(${ID})\\s*${ATTRS_BLOCK}`;
    const ELT_BLOCK = `${ELT}\\s*\\{\\s*(.*?)\\s*\\}`;
    const elt_m = RegExp(ELT_BLOCK).exec(content);

    if (elt_m) {
      const attrs: Attrs = {};
      let attrs_str = elt_m[2] || '';
      let attrs_m = RegExp(ATTR, 'gm').exec(attrs_str);
      while (attrs_m) {
        attrs[attrs_m[1]] = parse_str(attrs_m[2]);
        attrs_str = attrs_str.replace(attrs_m[0], '');
        attrs_m = RegExp(ATTR, 'gm').exec(attrs_str);
      }
      const elt = element(elt_m[1] as EltName, attrs, text(elt_m[7]));
      return elt.render(locale);
    }

    return content;
  }
}

export function text(value: string, translations: Translations = {}): Text {
  return new Text(value, translations);
}

export function component(
  name: string,
  props: Props = {},
  ...nodes: Node[]
): Component {
  return new Component(name, props, ...nodes);
}

export function element(
  name: EltName,
  attrs: Attrs = {},
  ...nodes: Node[]
): Element {
  return new Element(name, attrs, ...nodes);
}

export function template(content: string | TemplateStringsArray): Template {
  return new Template(content);
}

export function render(node: Node, locale?: Locale): string {
  return node.render(locale);
}
