import {
  appendInitialChild,
  createInstance,
  createTextInstance,
} from "hostConfig";
import { FiberNode } from "./fiber";
import { NoFlags } from "./fiberFlags";
import { HostComponent, HostRoot, HostText } from "./workTags";

// 递归中的归
/**
 * 
 * 构建离屏 DOM 树
 * 标记 Update flags
 * flags 分布在不同的 FiberNode 中，如何快速找到？
 * 利用 completeWork 向上遍历的流程，将子 FiberNode flags 冒泡到 父FiberNode
 * @returns 
 */
export const completeWork = (wip: FiberNode) => {
  const newProps = wip.pendingProps;
  const current = wip.alternate;
  switch (wip.tag) {
    case HostComponent:
      // 构建 Dom
      // DOM 插入 DOM 树中
      // stateNode 就是 Dom 结构
      if (current !== null && wip.stateNode) {
        // update
      } else {
        // instance 就是 DOM 
        const instance = createInstance(wip.type, newProps);
        // 将 instance 插入 DOM 树中
        appendAllChildren(instance, wip);
        wip.stateNode = instance;
      }
      bubleProperties(wip);
      return null;
    case HostText:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        const instance = createTextInstance(newProps.content);
        wip.stateNode = instance;
      }
      bubleProperties(wip);
      return null;

    case HostRoot:
      bubleProperties(wip);
      return null;
    default:
      if (__DEV__) {
        console.warn("未处理的 completeWork情况");
      }
  }
};

function appendAllChildren(parend: FiberNode, wip: FiberNode) {
  let node = wip.child;
  // 先往下找，插入
  // 再往兄弟节点找
  // 再往上找

  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parend, node?.stateNode);
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === wip) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === wip) {
        return;
      }
      node = node?.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function bubleProperties(wip: FiberNode) {
  let subtreeFlags = NoFlags;
  let child = wip.child;

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;

    child.return = wip;
    child = child.sibling;
  }

  wip.subtreeFlags |= subtreeFlags;
}
