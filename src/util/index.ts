import _ from "lodash";
import { _take } from "./_take";
import { _page } from "./_page";
import { _sort } from "./_sort";
import { _where } from "./_where";
import { _select } from "./_select";
import { _include } from "./_include";
import { _cursor } from "./_cursor";
import { _omit } from "./_omit";
import type { Object } from "../types";

export const QueryBuilder = (query: Object) => {
  const take = _take(query);
  const skip = _page(query, take);
  const orderBy = _sort(query);
  const where = _where(query);
  const select = _select(query);
  const include = _include(query);
  const cursor = _cursor(query);
  const omit = _omit(query);
  return {
    ...(cursor && { cursor }),
    take,
    ...(!cursor && { skip }),
    ...(orderBy && { orderBy }),
    ...(where && !_.isEmpty(where) && { where }),
    ...(select && { select }),
    ...(include && { include }),
    ...(omit && { omit }),
  };
};
