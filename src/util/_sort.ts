import _ from 'lodash';
import type { Sort } from '../types';
import { _nestedDotNotation } from '../common';

export const _sort = (q: Record<string, any>): Array<Sort> | undefined => {
  let sort = _.get(q, 'sort');
  if (!sort) return;

  sort = sort.split(',') || [];
  return sort.map((field: string) => {
    const prefix = field.startsWith('-');
    const fieldHasRemovedPrefix = prefix ? field.slice(1) : field;
    const direction: 'asc' | 'desc' = prefix ? 'desc' : 'asc';

    return _nestedDotNotation(fieldHasRemovedPrefix, direction);
  });
}