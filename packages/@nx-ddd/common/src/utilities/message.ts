export function message(
  strings: TemplateStringsArray,
  ...keys: (string | number)[]
): string {
  return strings.reduce((prev, current, index) => {
    const key = keys[index - 1];
    return `${prev}${key}${current}`;
  }).replace(/\n[ \t]+/g, '\n');
}
