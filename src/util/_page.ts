import _ from 'lodash';
import type { Object } from '../types';

export const _page = (query: Object, take: number = 10): number => {
  const page = _.toInteger(_.get(query, 'page', 1));
  return (page - 1) * take
}