import { Action } from "shared/ReactTypes";

/**
 * react 中触发更新的两种方式 
 * this.setState({a: 1})
 * this.setState(({a: 1})=>({a: 2}))
 */
export interface Update<State> {
  action: Action<State>;
}

export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null;
  };
}

/** 代表更新的数据结构 */
export const createUpdate = <State>(action: Action<State>): Update<State> => {
  return {
    action,
  };
};

/** 消费 update
 *  UpdateQueue: {
 *   shared: {
 *     pending: {
 *       // update
 *       // update 
 *      }
 *   }
 * }
 */
export const createUpdateQueue = <State>() => {
  return {
    shared: {
      pending: null,
    },
  } as UpdateQueue<State>;
};

export const enqueueUpdteQueue = <State>(
  updateQueue: UpdateQueue<State>,
  update: Update<State>
) => {
  updateQueue.shared.pending = update;
};

// 消费 update
export const processUpdateQueue = <State>(
  baseState: State,
  pendingUpdate: Update<State> | null
): { memoizedState: State } => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizedState: baseState,
  };

  if (pendingUpdate !== null) {
    // baseState 1 pendingUpdate 2 => memoizedState 2
    // baseState 1 pendingUpdate(x) => 5x => memoizedState 5
    const action = pendingUpdate.action;
    if (action instanceof Function) {
      result.memoizedState = action(baseState);
    } else {
      result.memoizedState = baseState;
    }
  }
  return result;
};
