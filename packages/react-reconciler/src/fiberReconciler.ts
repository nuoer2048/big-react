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

export function createContainer(container: Container) {
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  const root = new FiberRootNode(container, hostRootFiber);
  hostRootFiber.updateQueue = createUpdateQueue();
  return root;
}

export function updateConteiner(el: ReactElment, root: FiberRootNode) {
  const hostRrootFiber = root.current;
  const update = createUpdate<ReactElment>(el);
  enqueueUpdteQueue(hostRrootFiber.updateQueue as any, update);
  scheduleUpdateOnFiber(hostRrootFiber);
  return el;
}
