export type Nullable<T> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends any[]
      ? T[K]
      : Nullable<T[K]>
    : T[K] | null;
};

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
