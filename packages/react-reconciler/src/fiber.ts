import { Props, Key, Ref, ReactElment } from "shared/ReactTypes";
import { FunctionComponent, HostComponent, WorkTag } from "./workTags";
import { Flags, NoFlags } from "./fiberFlags";
import { Container } from "hostConfig";

/** 介于 ReactElement 与 DomeElement 之间，用于 Reconciler 消费的结构 */
/** jsx 消费顺序是 DFS ， 先子节点再兄节点 */
export class FiberNode {
  tag: WorkTag;
  key: Key;
  stateNode: any;
  type: any;

  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;

  ref: Ref;
  pendingProps: Props;
  memoizedProps: Props;
  // 用于 current 和 workInProgress 的切换,， 比如当前这个 FiberNode 为 current 那么 alternate 就为 workInProgress
  alternate: FiberNode | null;
  flags: Flags;
  updateQueue: unknown;
  memoizedState: any;
  subtreeFlags: Flags;

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    
    this.tag = tag;
    this.key = key;
    // div stateNode 就保存了 div 这个Dom
    this.stateNode = null;
    // 对于 fc tag 是 0， type: ()=>{}
    this.type = null;

    // 指向父 fiberNode
    this.return = null;
    //指向右边 fiberNode
    this.sibling = null;
    this.child = null;
    // 同级的 fiberNode，的 index
    this.index = 0;
  
    this.ref = null;

    // 工作单元
    // 刚开始准备的 props
    this.pendingProps = pendingProps;
    // 确定下来的 props
    this.memoizedProps = null;
    // 
    this.updateQueue = null;
    this.memoizedState = null;

    this.alternate = null;
    // 标记： 比如删除、更新、插入
    this.flags = NoFlags;
    // 子树中包含的 flags， 通过判断 subtreeFlags 是否是 NoFlags 来判断 子 Fiber 树中是否存在副作用
    this.subtreeFlags = NoFlags;
  }
}

export class FiberRootNode {
  // rootElement 
  container: Container;
  current: FiberNode;
  /** 更新完成以后的 hostRootFiner */
  finishedWork: FiberNode | null;
  constructor(container: Container, hostRootRiber: FiberNode) {
    this.container = container;
    this.current = hostRootRiber;
    hostRootRiber.stateNode = this;
    this.finishedWork = null;
  }
}
export function createWorkInProgress(
  current: FiberNode,
  pendingProps: Props
): FiberNode {
  let wip = current.alternate;
  // 首屏渲染 mount
  if (wip === null) {
    wip = new FiberNode(current.tag, pendingProps, current.key);
    wip.stateNode = current.stateNode;
    wip.alternate = current;
    current.alternate = wip;
  } else {
    // update
    wip.pendingProps = pendingProps;

    // 副作用
    wip.flags = NoFlags;
    wip.subtreeFlags = NoFlags;
  }

  wip.type = current.type;
  wip.updateQueue = current.updateQueue;
  wip.child = current.child;
  wip.memoizedProps = current.memoizedProps;
  wip.memoizedState = current.memoizedState;

  return wip;
}

export function createFiberFromElement(element: ReactElment): FiberNode {
  const { type, key, props } = element;

  let fiberTag: WorkTag = FunctionComponent;
  if (typeof type === "string") {
    // <div/>
    fiberTag = HostComponent;
  } else if (typeof type !== "function" && __DEV__) {
    console.log("未定义tyle类型");
  }

  const fiber = new FiberNode(fiberTag, props, key);
  fiber.type = type;
  return fiber;
}
