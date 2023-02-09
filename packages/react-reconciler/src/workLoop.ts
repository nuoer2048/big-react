import { beginWork } from "./beginWork";
import { completeWork } from "./completeWork";
import { createWorkInProgress, FiberNode, FiberRootNode } from "./fiber";
import { HostRoot } from "./workTags";

// 正在工作fiberNode
let workInProgress: FiberNode | null;

function prepareFreshStask(root: FiberRootNode) {
  // 这里需要找到 hostRootFiber
  workInProgress = createWorkInProgress(root?.current, {});
}

// 在 Fiber 中调度 update 功能
/**
 * 1. ReactDom.render() || ReactDom.creareRoot().render()  首屏渲染
 * 2. this.setState(x) || this.setState((x)=>nx)
 *  react 里面是从根 rootFiberNode 开始往下遍历， 但是触发更新可能在任意的 fiberNode 中，所以我们需要先向上归到 rootFiberNode
 */
export function scheduleUpdateOnFiber(fiber: FiberNode) {
  // fiberRootNode
  const root = markUpdateFromFiberToRoot(fiber);
  renderRoot(root);
}

// 向上递归到 rootFiberNode
function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }

  if (node.tag === HostRoot) {
    return node;
  }
  return null;
}

/** 触发更新的 api ，会调用 renderRoot
 * ReactDom.render() 或新版本的 ReactDom.createRoot().render()
 * this.setState
 * useState 的 dispatch 方法
 */
function renderRoot(root: FiberNode | null) {
  // 初始化
  prepareFreshStask(root);
  do {
    try {
      workLoop();
      break;
    } catch (error) {
      if (__DEV__) {
        console.warn("workInProgress 发生错误");
      }
      workInProgress = null;
    }
  } while (true);
   
  const finishWork = root.current.alternate;
  root.finishedWork = finishWork;
  
  // wip FiberNode 树。 以及 树中的 Flags ,实现首屏渲染
  commitRoot(root);
}

// 先向下递归比对子节点，再比对兄弟节点
function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber);
  fiber.memoizedProps = fiber.pendingProps;
  if (next === null) {
    compeleUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}
function compeleUnitOfWork(fiber: FiberNode) {
  let node: FiberNode = fiber || null;
  do {
    completeWork(node);
    const sibling = node.sibling;
    if (sibling !== null) {
      workInProgress = sibling;
      return;
    } else {
      node = node.return;
      workInProgress = node;
    }
  } while (true);
}
