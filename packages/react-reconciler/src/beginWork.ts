import { ReactElment } from "shared/ReactTypes";
import { FiberNode } from "./fiber";
import { processUpdateQueue, UpdateQueue } from "./updateQueue";
import { HostComponent, HostRoot, HostText } from "./workTags";
import { reconcileChildFibers, mountChildFibers } from "./childFibers";

// 递归中的递。
/**
 * 通过对比 current FiberNode 与 createElement 做对比生成 workProgress FiberNode 
 * 在此过程中最多会标记 2 类 与「结构变化」相关的 flags 
 * - Placement
 * - ChildDeletion 
 */
export const beginWork = (wip: FiberNode) => {
  switch (wip.tag) {
    case HostRoot:
      /**
       * 计算状态的最新值
       * 创建子 FiberNode
       */
      return updateHostRoot(wip);
    case HostComponent:
      return updateHostComponent(wip);
    case HostText:
      return null;
    default:
      if (__DEV__) {
        console.warn("未实现相关节点类型");
      }
  }
  return null;
};

function updateHostRoot(wip: FiberNode) {
  const baseState = wip.memoizedState;
  const updateQueue = wip.updateQueue as UpdateQueue<Element>;
  const pending = updateQueue.shared.pending;
  updateQueue.shared.pending = null;
  const { memoizedState } = processUpdateQueue(baseState, pending);
  wip.memoizedState = memoizedState;
  // 传进来的 APP ReactElement
  const nextChildren = wip.memoizedState;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

/**
 * 
 * 创建子 FoiberNode
 * @returns 
 */
function updateHostComponent(wip: FiberNode) {
  const nextProps = wip.pendingProps;
  const nextChildren = nextProps.children;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

/**
 * 
 */
function reconcileChildren(wip: FiberNode, children?: ReactElment) {
  // 父节点
  const current = wip.alternate;
  // update
  if (current !== null) {
    wip.child = reconcileChildFibers(wip, current?.child, children);
  } else {
    // mount  执行一次 placement
    wip.child = mountChildFibers(wip, null, children);
  }
}
