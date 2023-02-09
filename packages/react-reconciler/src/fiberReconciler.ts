import { Container } from "hostConfig";
import { ReactElment } from "shared/ReactTypes";
import { FiberNode, FiberRootNode } from "./fiber";
import {
  createUpdate,
  createUpdateQueue,
  enqueueUpdteQueue,
} from "./updateQueue";
import { HostRoot } from "./workTags";
import { scheduleUpdateOnFiber } from "./workLoop";

/**
 * createRoot(root:Container) 执行的操作
 * 
 */
export function createContainer(container: Container) {
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  const root = new FiberRootNode(container, hostRootFiber);
  hostRootFiber.updateQueue = createUpdateQueue();
  return root;
}

/**
 * createRoot(root: Container).render(<App/>) 函数里面执行的操作
 *
 */
export function updateConteiner(el: ReactElment, root: FiberRootNode) {
  const hostRrootFiber = root.current;
  // 首屏渲染，触发更新 
  // update 代表更新的数据
  // updateQueue 是消费 update
  const update = createUpdate<ReactElment>(el);
  enqueueUpdteQueue(hostRrootFiber.updateQueue as any, update);
  scheduleUpdateOnFiber(hostRrootFiber);
  return el;
}
