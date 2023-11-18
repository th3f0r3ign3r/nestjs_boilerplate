export const getDateInFuture = (minutes: number): Date => {
  const now = new Date();
  const future = new Date(now.getTime() + minutes * 60000);
  return future;
};

export const omitObjectKeys = <T extends object, K extends keyof T>(
  object: T,
  keys: K[],
): Omit<T, K> => {
  const newObject = Object.assign({}, object);
  for (const key of keys) delete newObject[key];
  return newObject;
};

export const onlyObjectKeys = <T extends object, K extends keyof T>(
  object: T,
  keys: K[],
): Pick<T, K> => {
  const newObject = {} as Pick<T, K>;
  for (const key of keys) newObject[key] = object[key];
  return newObject;
};
