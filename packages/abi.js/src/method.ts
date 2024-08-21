export const GET = 'GET';
export const HEAD = 'HEAD';
export const POST = 'POST';
export const PUT = 'PUT';
export const DELETE = 'DELETE';
export const ACL = 'ACL';
export const BASELINE_CONTROL = 'BASELINE-CONTROL';
export const BIND = 'BIND';
export const CHECKIN = 'CHECKIN';
export const CHECKOUT = 'CHECKOUT';
export const CONNECT = 'CONNECT';
export const COPY = 'COPY';
export const LABEL = 'LABEL';
export const LINK = 'LINK';
export const LOCK = 'LOCK';
export const MERGE = 'MERGE';
export const MKACTIVITY = 'MKACTIVITY';
export const MKCALENDAR = 'MKCALENDAR';
export const MKCOL = 'MKCOL';
export const MKREDIRECTREF = 'MKREDIRECTREF';
export const MKWORKSPACE = 'MKWORKSPACE';
export const MOVE = 'MOVE';
export const OPTIONS = 'OPTIONS';
export const ORDERPATCH = 'ORDERPATCH';
export const PATCH = 'PATCH';
export const PRI = 'PRI';
export const PROPFIND = 'PROPFIND';
export const PROPPATCH = 'PROPPATCH';
export const REBIND = 'REBIND';
export const REPORT = 'REPORT';
export const SEARCH = 'SEARCH';
export const TRACE = 'TRACE';
export const UNBIND = 'UNBIND';
export const UNCHECKOUT = 'UNCHECKOUT';
export const UNLINK = 'UNLINK';
export const UNLOCK = 'UNLOCK';
export const UPDATE = 'UPDATE';
export const UPDATEREDIRECTREF = 'UPDATEREDIRECTREF';
export const VERSION_CONTROL = 'VERSION-CONTROL';
export const METHODS = [
  GET,
  HEAD,
  POST,
  PUT,
  DELETE,
  ACL,
  BASELINE_CONTROL,
  BIND,
  CHECKIN,
  CHECKOUT,
  CONNECT,
  COPY,
  LABEL,
  LINK,
  LOCK,
  MERGE,
  MKACTIVITY,
  MKCALENDAR,
  MKCOL,
  MKREDIRECTREF,
  MKWORKSPACE,
  MOVE,
  OPTIONS,
  ORDERPATCH,
  PATCH,
  PRI,
  PROPFIND,
  PROPPATCH,
  REBIND,
  REPORT,
  SEARCH,
  TRACE,
  UNBIND,
  UNCHECKOUT,
  UNLINK,
  UNLOCK,
  UPDATE,
  UPDATEREDIRECTREF,
  VERSION_CONTROL,
];
export type Get = typeof GET;
export type Head = typeof HEAD;
export type Post = typeof POST;
export type Put = typeof PUT;
export type Delete = typeof DELETE;
export type Acl = typeof ACL;
export type BaselineControl = typeof BASELINE_CONTROL;
export type Bind = typeof BIND;
export type Checkin = typeof CHECKIN;
export type Checkout = typeof CHECKOUT;
export type Connect = typeof CONNECT;
export type Copy = typeof COPY;
export type Label = typeof LABEL;
export type Link = typeof LINK;
export type Lock = typeof LOCK;
export type Merge = typeof MERGE;
export type Mkactivity = typeof MKACTIVITY;
export type Mkcalendar = typeof MKCALENDAR;
export type Mkcol = typeof MKCOL;
export type Mkredirectref = typeof MKREDIRECTREF;
export type Mkworkspace = typeof MKWORKSPACE;
export type Move = typeof MOVE;
export type Options = typeof OPTIONS;
export type Orderpatch = typeof ORDERPATCH;
export type Patch = typeof PATCH;
export type Pri = typeof PRI;
export type Propfind = typeof PROPFIND;
export type Proppatch = typeof PROPPATCH;
export type Rebind = typeof REBIND;
export type Report = typeof REPORT;
export type Search = typeof SEARCH;
export type Trace = typeof TRACE;
export type Unbind = typeof UNBIND;
export type Uncheckout = typeof UNCHECKOUT;
export type Unlink = typeof UNLINK;
export type Unlock = typeof UNLOCK;
export type Update = typeof UPDATE;
export type Updateredirectref = typeof UPDATEREDIRECTREF;
export type VersionControl = typeof VERSION_CONTROL;
export type Method = (typeof METHODS)[number];

export function isMethod(method: string): method is Method {
  return method in METHODS;
}

export function isGet(method: string): method is Get {
  return method === GET;
}

export function isHead(method: string): method is Head {
  return method === HEAD;
}

export function isPost(method: string): method is Post {
  return method === POST;
}

export function isPut(method: string): method is Put {
  return method === PUT;
}

export function isDelete(method: string): method is Delete {
  return method === DELETE;
}

export function isAcl(method: string): method is Acl {
  return method === ACL;
}

export function isBaselineControl(method: string): method is BaselineControl {
  return method === BASELINE_CONTROL;
}

export function isBind(method: string): method is Bind {
  return method === BIND;
}

export function isCheckin(method: string): method is Checkin {
  return method === CHECKIN;
}

export function isCheckout(method: string): method is Checkout {
  return method === CHECKOUT;
}

export function isConnect(method: string): method is Connect {
  return method === CONNECT;
}

export function isCopy(method: string): method is Copy {
  return method === COPY;
}

export function isLabel(method: string): method is Label {
  return method === LABEL;
}

export function isLink(method: string): method is Link {
  return method === LINK;
}

export function isLock(method: string): method is Lock {
  return method === LOCK;
}

export function isMerge(method: string): method is Merge {
  return method === MERGE;
}

export function isMkactivity(method: string): method is Mkactivity {
  return method === MKACTIVITY;
}

export function isMkcalendar(method: string): method is Mkcalendar {
  return method === MKCALENDAR;
}

export function isMkcol(method: string): method is Mkcol {
  return method === MKCOL;
}

export function isMkredirectref(method: string): method is Mkredirectref {
  return method === MKREDIRECTREF;
}

export function isMkworkspace(method: string): method is Mkworkspace {
  return method === MKWORKSPACE;
}

export function isMove(method: string): method is Move {
  return method === MOVE;
}

export function isOptions(method: string): method is Options {
  return method === OPTIONS;
}

export function isOrderpatch(method: string): method is Orderpatch {
  return method === ORDERPATCH;
}

export function isPatch(method: string): method is Patch {
  return method === PATCH;
}

export function isPri(method: string): method is Pri {
  return method === PRI;
}

export function isPropfind(method: string): method is Propfind {
  return method === PROPFIND;
}

export function isProppatch(method: string): method is Proppatch {
  return method === PROPPATCH;
}

export function isRebind(method: string): method is Rebind {
  return method === REBIND;
}

export function isReport(method: string): method is Report {
  return method === REPORT;
}

export function isSearch(method: string): method is Search {
  return method === SEARCH;
}

export function isTrace(method: string): method is Trace {
  return method === TRACE;
}

export function isUnbind(method: string): method is Unbind {
  return method === UNBIND;
}

export function isUncheckout(method: string): method is Uncheckout {
  return method === UNCHECKOUT;
}

export function isUnlink(method: string): method is Unlink {
  return method === UNLINK;
}

export function isUnlock(method: string): method is Unlock {
  return method === UNLOCK;
}

export function isUpdate(method: string): method is Update {
  return method === UPDATE;
}

export function isUpdateredirectref(
  method: string,
): method is Updateredirectref {
  return method === UPDATEREDIRECTREF;
}

export function isVersionControl(method: string): method is VersionControl {
  return method === VERSION_CONTROL;
}
