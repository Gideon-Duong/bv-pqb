import _ from 'lodash';
import type { Object } from '../types';
import { _nestedDotNotation } from '../common';

export const _omit = (query: Object): Object | undefined => {
  let omit = _.get(query, 'omit');
  if (!omit) return;

  let r = {};
  omit = omit.match(/(?:[^(,]+(?:\([^)]*\))?)+/g)?.map((f: string) => f.trim()) ??
    [];
  omit.map((field: string) => {
    r = _.merge(r, _nestedDotNotation(field, true));
  });
  return r;
}