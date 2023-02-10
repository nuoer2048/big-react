import { FiberNode } from "./fiber";
import { MutationMask, NoFlags, Placement } from "./fiberFlags";
import { appendChildToContainer } from "./hostConfig";
import { Container } from "./hostConfig";
import { HostText } from "./workTags";
import { HostRoot } from "./workTags";
import { HostComponent } from "./workTags";

export const commitMutationEffects = (finishedWork: FiberNode) => {
    nextEffect = finishedWork;

    while (nextEffect !== null) {
        const child = nextEffect.child;

        // 找到有 flags 的节点
        if ((nextEffect.subtreeFlags & MutationMask) != NoFlags && child !== null) {
            nextEffect = child;
        } else {
            // 向上遍历
            up: while (nextEffect !== null) {
                commitMutationEffectsOnFiber(nextEffect);
                const sibling = nextEffect.sibling;
                if (sibling !== null) {
                    nextEffect = sibling;
                    break up;
                }
                nextEffect = nextEffect.return;
            }
        }

    }
}


/**
 * 
 * @param finishedWork 真正存在 flags 的节点
 */
const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
    if (__DEV__) {
        console.warn("执行 Placement 操作")
    }

    const flags = finishedWork.flags;

    // Placement
    if ((flags & Placement) != NoFlags) {

        // 从 flags 中删除 placement
        finishedWork.flags &= ~Placement;
    }

}

export const commitPlacement = (finishedWork: FiberNode) => {
    // 找到 可以执行 placement 的 parent
    const hostParent = getHostParent(finishedWork);
    // appendChild
    appendPlacmentNodeIntoContainer(finishedWork, hostParent)
}

export const getHostParent = (fiber: FiberNode) => {
    const parent = fiber.parent;

    while (parent) {
        const parenttag = parent.tag;
        if (parenttag === HostComponent) {
            return parent.stateNode;
        }

        if (parenttag === HostRoot) {
            return parent.stateNode.container;
        }
        parent = parent.return;
    }

    if (__DEV__) {
        console.warn("没有找到 host parent")
    }
}

function appendPlacmentNodeIntoContainer(finishedWork: FiberNode, hostParent: Container) {
    if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
        appendChildToContainer(finishedWork.stateNodem, hostParent);
        return;
    }

    const child = finishedWork.child;
    if (child !== null) {
        appendPlacmentNodeIntoContainer(child, hostParent);

        const sibling = child.sibling;
        while (sibling !== null) {
            appendPlacmentNodeIntoContainer(sibling, hostParent)
            sibling = sibling.sibling;
        }

    }

}