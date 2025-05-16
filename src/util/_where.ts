import _ from 'lodash';
import { _nestedDotNotation } from '../common';

type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONValue[];

const _parseValue = (value: string): boolean | number | string | string[] => {
  if (value === "true") return true;
  if (value === "false") return false;
  if (!isNaN(+value)) return +value;
  if (value.includes(",")) {
    const parsed = value.split(",").map(v => {
      const parsedValue = _parseValue(v.trim());
      if (typeof parsedValue === 'string') return parsedValue;
      return String(parsedValue);
    });
    return parsed;
  }
  return value;
}

const _transformOrAndToUppercase = <T extends JSONValue>(input: T): T => {
  if (_.isArray(input)) {
    return input.map(_transformOrAndToUppercase) as T;
  }

  if (_.isPlainObject(input)) {
    const result: JSONObject = {};
    for (const [key, value] of Object.entries(input as JSONObject)) {
      const newKey = ['and', 'or'].includes(key.toLowerCase()) ? key.toUpperCase() : key;
      result[newKey] = _transformOrAndToUppercase(value);
    }
    return result as T;
  }

  return input;
};

export const _where = (query: Object): any => {
  const where = _.omit(query, ['page', 'take', 'sort']);

  let r = {};
  for (const [k, v] of Object.entries(where)) {
    const parseValue = _parseValue(v as unknown as string);
    const [path, op = 'eq'] = k.split("__");

    const finalValue = op === 'eq' ? parseValue : { [op]: parseValue }

    r = _.merge(r, _nestedDotNotation(path, finalValue));

  }

  return _transformOrAndToUppercase(r);
}