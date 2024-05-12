import { capitalize } from '.';

export function underscoreToCamel(string) {
  let [start, ...remaining] = string.split('_');
  const upperRem = remaining.map(word => capitalize(word)).join('');
  return `${start}${upperRem}`;
}
