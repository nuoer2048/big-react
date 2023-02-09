import { REACT_ELEMEANATA_SYMBOL } from "shared/ReactSymbols";
import { ReactElment } from "shared/ReactTypes";
import { FiberNode, createFiberFromElement } from "./fiber";
import { Placement } from "./fiberFlags";
import { HostText } from "./workTags";

/**
 * 
 * 
 * 是否应该收集副作用
 * @returns 
 */
function ChildReconciler(shouldTrackEffects: boolean) {
  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElment
  ) {
    const fiber = createFiberFromElement(element);
    fiber.return = returnFiber;
    return fiber;
  }

  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | number
  ) {
    // content 表示文本类型
    const fiber = new FiberNode(HostText, { content }, null);
    fiber.return = returnFiber;
    return fiber;
  }

  function placeSingleChild(fiber: FiberNode) {

    // alternate === null 代表首屏渲染
    if (shouldTrackEffects && fiber.alternate === null) {
      fiber.flags |= Placement;
    }

    return fiber;
  }

  return function reconcileChildFibers(
    // 父 FiberNode
    returnFiber: FiberNode,
    // 子节点的 FiberNode
    currentFiber: FiberNode | null,
    // 子节点的 Elementy
    newChild?: ReactElment
  ) {

    // 
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMEANATA_SYMBOL:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFiber, newChild)
          );
        default:
          if (__DEV__) {
            console.warn("未找到对应实现");
          }
          break;
      }
    }

    if (typeof newChild === "string" || typeof newChild === "number") {
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFiber, newChild)
      );
    }

    if (__DEV__) {
      console.log("未实现");
    }

    return null;
  };
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
