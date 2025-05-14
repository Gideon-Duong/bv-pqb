import _ from 'lodash';
import { _take } from './_take';
import { _page } from './_page';
import { _sort } from './_sort';
import type { Object } from '../types';

export class QueryBuilder {
  public build(q: Object) {
    const take = _take(q);
    const skip = _page(q, take);
    const orderBy = _sort(q);

    return {
      take,
      skip,
      ...orderBy && { orderBy },
    };
  }
}
