export function Effect(id: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.debug('target:', target);
    target['_effectMap'] ??= new Map<string, string>();
    target['_effectMap'].set(id, propertyKey);
    return descriptor;
  };
}
