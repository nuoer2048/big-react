export type Type = any;
export type Ref = any;
export type Props = any;
export type Key = any;
export type ElementType = any;

export interface ReactElment {
  key: Key;
  type: ElementType;
  props: Props;
  ref: Ref;
  __mark: string;
  $$typeof: symbol | string;
}

export type Action<State> = State | ((preState: State) => State);
