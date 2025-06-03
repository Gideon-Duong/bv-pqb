import _ from 'lodash';
import type { Object, Sort } from '../types';
import { _nestedDotNotation } from '../common';

export const _sort = (query: Object): Array<Sort> | undefined => {
  let sort = _.get(query, 'sort');
  if (!sort) return;

  sort = sort.match(/(?:[^(,]+(?:\([^)]*\))?)+/g)?.map((f: string) => f.trim()) ??
    [];
  return sort.map((field: string) => {
    const prefix = field.startsWith('-');
    const fieldHasRemovedPrefix = prefix ? field.slice(1) : field;
    const direction: 'asc' | 'desc' = prefix ? 'desc' : 'asc';

    return _nestedDotNotation(fieldHasRemovedPrefix, direction);
  });
}