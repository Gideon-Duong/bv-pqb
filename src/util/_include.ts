import _ from "lodash";
import { Object } from "../types";
import queryString from "query-string";
import { _nestedDotNotation } from "../common";
import { QueryBuilder } from ".";

type IncludeTree = true | { include: Record<string, IncludeTree> };

const _nestedSelect = (keys: string[]): Record<string, IncludeTree> => {
  let acc: IncludeTree = true;
  for (let i = keys.length - 1; i >= 0; i--) {
    acc = { include: { [keys[i]]: acc } };
  }
  return (acc as { include: Record<string, IncludeTree> }).include;
};

export const _include = (query: Object): Object | undefined => {
  let include = _.get(query, "include");
  if (!include) return;

  let r = {};
  include =
    include.match(/(?:[^(,]+(?:\([^)]*\))?)+/g)?.map((f: string) => f.trim()) ??
    [];

  include.map((field: string) => {
    const split = field.split(".");
    if (split.length > 1) {
      const conditions = _.find(split, (part) => /^query\(.+\)$/.test(part));
      if (conditions) {
        const key = split.slice(0, -1).join(".");
        const match = conditions.match(/^([^\(]+)\(([^)]+)\)$/);
        if (match) {
          const value = match[2];
          const query = `?${value.replaceAll("|", "&")}`;
          const parsed = queryString.parse(query);
          const builder = QueryBuilder(parsed);
          const result = _nestedDotNotation(key, builder);
          r = _.merge(r, result);
        }
        return;
      } else {
        r = _.merge(r, _nestedSelect(split));
      }
    } else {
      r = _.merge(r, _nestedDotNotation(field, true));
    }
  });
  return r;
};
