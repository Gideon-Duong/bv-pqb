import _ from "lodash";
import { Object } from "../types";
import queryString from "query-string";
import { _nestedDotNotation } from "../common";
import { QueryBuilder } from ".";

type SelectTree = true | { select: Record<string, SelectTree> };

const _nestedSelect = (keys: string[]): Record<string, SelectTree> => {
  let acc: SelectTree = true;
  for (let i = keys.length - 1; i >= 0; i--) {
    acc = { select: { [keys[i]]: acc } };
  }
  return (acc as { select: Record<string, SelectTree> }).select;
};

export const _select = (query: Object): Object | undefined => {
  let select = _.get(query, "select");
  if (!select) return;

  let r = {};
  select =
    select.match(/(?:[^(,]+(?:\([^)]*\))?)+/g)?.map((f: string) => f.trim()) ??
    [];
  select.map((field: string) => {
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
