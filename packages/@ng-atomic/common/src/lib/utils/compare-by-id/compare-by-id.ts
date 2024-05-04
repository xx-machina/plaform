export type HasId = { id: string };
export function compareByIdFactory(key: string) {
  return (a: any, b: any) => parseInt(a?.[key], 10) - parseInt(b?.[key], 10);
}
export const compareById = compareByIdFactory('id');
