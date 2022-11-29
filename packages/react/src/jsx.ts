import { REACT_ELEMEANATA_SYMBOL } from "shared/ReactSymbols";
import {
  Type,
  Key,
  Props,
  Ref,
  ReactElment,
  ElementType,
} from "shared/ReactTypes";

export const ReactElement = function (
  type: Type,
  key: Key,
  ref: Ref,
  props: Props
): ReactElment {
  const element = {
    $$typeof: REACT_ELEMEANATA_SYMBOL,
    type,
    key,
    ref,
    props,
    __mark: "haiqiong",
  };
  return element;
};

export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
  let key: Key = null;
  let ref: Ref = null;
  const props: Props = {};

  for (const prop in config) {
    const val = config[prop];
    if (prop === "key") {
      if (val !== undefined) {
        key = "" + val;
      }
      continue;
    }

    if (prop === "ref") {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }

    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }

  const maybeChildrenLength = maybeChildren.length;
  if (maybeChildrenLength) {
    if (maybeChildrenLength === 1) {
      props.children = maybeChildren[0];
    } else {
      props.children = maybeChildren;
    }
  }
  return ReactElement(type, key, ref, props);
};

export const jsxDEV = (
  type: ElementType,
  config: any,
  ...maybeChildren: any
) => {
  let key: Key = null;
  let ref: Ref = null;
  const props: Props = {};

  for (const prop in config) {
    const val = config[prop];
    if (prop === "key") {
      if (val !== undefined) {
        key = "" + val;
      }
      continue;
    }

    if (prop === "ref") {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }

    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }

  return ReactElement(type, key, ref, props);
};
