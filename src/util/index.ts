import _ from 'lodash';
import { _take } from './_take';
import { _page } from './_page';
import { _sort } from './_sort';
import { _where } from './_where';
import type { Object } from '../types';

export const QueryBuilder = (query: Object) => {
  const take = _take(query);
  const skip = _page(query, take);
  const orderBy = _sort(query);
  const where = _where(query);
  return {
    take,
    skip,
    ...orderBy && { orderBy },
    ...where && !_.isEmpty(where) && { where },
  };
}
