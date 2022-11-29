const supports = typeof Symbol === "function" && Symbol.for;

export const REACT_ELEMEANATA_SYMBOL = supports
  ? Symbol.for("react.element")
  : "0UUIO";
