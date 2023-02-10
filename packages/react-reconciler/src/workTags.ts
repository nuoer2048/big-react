// fiber 节点的类型, 什么类型的节点
export type WorkTag =
  | typeof FunctionComponent
  // 挂载的跟节点
  | typeof HostRoot
  // div 对应的 FiberNode
  | typeof HostComponent
  // div 里面的文本对应的节点
  | typeof HostText;
// 这是 （） => React.Node
export const FunctionComponent = 0;

// react.render 的那个节点
export const HostRoot = 3;
// div
export const HostComponent = 5;
// <div>123</div>里面的 123
export const HostText = 6;
