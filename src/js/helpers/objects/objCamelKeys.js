import { underscoreToCamel } from '../string';

export function objCamelKeys(obj, separator = '_') {
  return Object.entries(obj).reduce((prev, curr) => {
    let [key, value] = curr;
    if (key.indexOf(separator) >= 0) key = underscoreToCamel(key);
    return { ...prev, [key]: value };
  }, {});
}
