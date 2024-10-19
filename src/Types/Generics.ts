export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? T[K] : never;
};
