import _ from "lodash";

type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONValue[];

export const _transformOrAndToUppercase = <T extends JSONValue>(input: T): T => {
  if (_.isArray(input)) {
    return input.map(_transformOrAndToUppercase) as T;
  }

  if (_.isPlainObject(input)) {
    const result: JSONObject = {};
    for (const [key, value] of Object.entries(input as JSONObject)) {
      const newKey = ["and", "or"].includes(key.toLowerCase())
        ? key.toUpperCase()
        : key;
      result[newKey] = _transformOrAndToUppercase(value);
    }
    return result as T;
  }

  return input;
};