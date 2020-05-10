export const to = <T>(promise: Promise<T>): Promise<[Error | undefined, T]> =>
  promise
    .then<[undefined, T]>((res: T) => [undefined, res])
    .catch<[Error, any]>((err: Error) => [err, undefined]);

export function findWithAttr(array: any[], attr: string, value: any): number {
  for(let i = 0; i < array.length; i += 1) {
    if(array[i][attr] === value) {
        return i;
    }
  }
  return -1;
}