import queryString from 'query-string';
import { QueryBuilder } from '../src'

const search = '?page=2&take=10&sort=-id,name,-createdAt';
const parsed = queryString.parse(search);
console.log('parsed', JSON.stringify(parsed, null, 2));

const prismaQuery = QueryBuilder(parsed);
console.log(JSON.stringify(prismaQuery, null, 2));