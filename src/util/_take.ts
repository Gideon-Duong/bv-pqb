import _ from 'lodash';
import type { Object } from '../types';

export const _take = (query: Object): number => {
  return _.toInteger(_.get(query, 'take', 10))
}