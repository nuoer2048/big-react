// fiber 节点的类型

export type WorkTag =
  | typeof FunctionComponent
  | typeof HostRoot
  | typeof HostComponent
  | typeof HostText;

export const FunctionComponent = 0;
// react.render 的那个节点
export const HostRoot = 3;
// div
export const HostComponent = 5;
// <div>123</div>里面的 123
export const HostText = 6;
