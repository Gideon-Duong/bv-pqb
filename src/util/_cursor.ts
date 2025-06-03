import _ from 'lodash';
import type { Object } from '../types';
import { _nestedDotNotation, _transformOrAndToUppercase } from '../common';

export const _cursor = (query: Object): Object | undefined => {
  let cursor = _.get(query, 'cursor');
  if (!cursor) return;

  let r = {};
  cursor =
    cursor.match(/(?:[^(,]+(?:\([^)]*\))?)+/g)?.map((f: string) => f.trim()) ??
    [];
  cursor.map((field: string) => {
    let [key, value] = field.split(':') as [string, string];
    let finalValue: string | number | boolean =
      _.toLower(value) === 'true' ? true :
        _.toLower(value) === 'false' ? false :
          !_.isNaN(Number(value)) ? Number(value) :
            value;
    r = _.merge(r, _nestedDotNotation(key, finalValue));
  })
  return _transformOrAndToUppercase(r);
}