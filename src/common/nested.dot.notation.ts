import _ from 'lodash';
import type { Object } from "../types";

/**
 * Eg: contact.name => { contact: { name: 'value' } }
 */
export const _nestedDotNotation = (field: string, value: unknown): Object => {
  const result: Object = {};
  _.set(result, field, value);
  return result;
}