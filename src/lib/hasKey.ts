export const hasKey = <T extends object>(obj: T, key: PropertyKey): key is keyof T => Object.hasOwn(obj, key);
