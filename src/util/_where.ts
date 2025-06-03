import _ from "lodash";
import { _nestedDotNotation, _transformOrAndToUppercase } from "../common";

const _parseValue = (value: string): boolean | number | string | string[] => {
  if (value === "true") return true;
  if (value === "false") return false;
  if (!isNaN(+value)) return +value;
  if (value.includes(",")) {
    const parsed = value.split(",").map((v) => {
      const parsedValue = _parseValue(v.trim());
      if (typeof parsedValue === "string") return parsedValue;
      return String(parsedValue);
    });
    return parsed;
  }
  return value;
};


export const _where = (query: Object): Object => {
  const where = _.omit(query, ["page", "take", "sort", "select", "include", "cursor", "omit"]);

  let r = {};
  for (const [k, v] of Object.entries(where)) {
    const parseValue = _parseValue(v as unknown as string);
    const [path, op = "eq"] = k.split("__");

    const finalValue = op === "eq" ? parseValue : { [op]: parseValue };

    r = _.merge(r, _nestedDotNotation(path, finalValue));
  }

  return _transformOrAndToUppercase(r);
};
