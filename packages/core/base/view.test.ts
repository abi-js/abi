import { expect, test } from "bun:test";
import {
  Component,
  Element,
  Node,
  Slot,
  Tag,
  Template,
  Text,
  component,
  element,
  template,
  text,
} from "./view";

test("Test text", () => {
  const txt = text("Hello", {
    fr_CI: "Salut",
  });

  expect(txt).toBeInstanceOf(Text);
  expect(txt).toBeInstanceOf(Node);
  expect(txt.value).toEqual("Hello");
  expect(txt.render()).toEqual("Hello");
  expect(txt.render("fr_CI")).toEqual("Salut");
  expect(txt.translateTo("fr_CI")).toEqual("Salut");
  expect(Text.translate("Salut").to("en_US")).toEqual("Hello");
  expect(Text.translate("Salut").to("fr_CI")).toEqual("Salut");
});

test("Test component", () => {
  const cmp = component(
    "MyHello",
    {
      name: "Sigui",
      age: 27,
    },
    element("p", {}, text("Hello"), element("b", {}, text("Sigui"))),
    element("p", {}, text("Age"), element("b", {}, text("25"))),
  );
  expect(cmp).toBeInstanceOf(Component);
  expect(cmp).toBeInstanceOf(Node);
  expect(cmp).toBeInstanceOf(Tag);
  expect(cmp.slot).toBeInstanceOf(Slot);
  expect(cmp.slot).toBeInstanceOf(Node);
  expect(cmp.is_empty).toBeFalse();
  expect(cmp.slot.render()).toEqual(
    "<p>Hello<b>Sigui</b></p><p>Age<b>25</b></p>",
  );
  expect(cmp.render()).toEqual(
    '<MyHello name="Sigui" age="27"><p>Hello<b>Sigui</b></p><p>Age<b>25</b></p></MyHello>',
  );
});

test("Test element", () => {
  const elt = element(
    "div",
    {
      id: "MyDiv",
    },
    text("Hello"),
    element("b", {}, text("World")),
  );
  expect(elt).toBeInstanceOf(Element);
  expect(elt).toBeInstanceOf(Node);
  expect(elt).toBeInstanceOf(Tag);
  expect(elt.slot).toBeInstanceOf(Slot);
  expect(elt.slot).toBeInstanceOf(Node);
  expect(elt.is_empty).toBeFalse();
  expect(elt.slot.render()).toEqual("Hello<b>World</b>");
  expect(elt.render()).toEqual('<div id="MyDiv">Hello<b>World</b></div>');
});

test("Test inline element", () => {
  const elt = element("br");
  const c_elt = element("br", {}, text("content"));

  expect(elt.is_inline).toBeTrue();
  expect(c_elt.is_inline).toBeTrue();
  expect(elt.is_empty).toBeTrue();
  expect(c_elt.is_empty).toBeFalse();
  expect(elt.is_paired).toBeFalse();
  expect(c_elt.is_paired).toBeFalse();
  expect(elt.is_custom).toBeFalse();
});

test("Test paired element", () => {
  const elt = element("p");
  expect(elt.is_inline).toBeFalse();
  expect(elt.is_empty).toBeTrue();
  expect(elt.is_paired).toBeTrue();
  expect(elt.is_custom).toBeFalse();
});

test("Test template", () => {
  const tpl = template`p[id="myP" class="my-4 mx-8" title='It\'s a Hello World'] { Bonjour le monde }`;
  const r =
    '<p id="myP" class="my-4 mx-8" title="It\'s a Hello World">Bonjour le monde</p>';
  expect(tpl).toBeInstanceOf(Template);
  expect(tpl.render()).toEqual(r);
});
