import queryString from 'query-string';
import { QueryBuilder } from '../src'

const search = '?page=3&take=12&sort=createAt,contacts.id';
const parsed = queryString.parse(search);
console.log('parsed', parsed);

const builder = new QueryBuilder();
const prismaQuery = builder.build(parsed);
console.log(JSON.stringify(prismaQuery, null, 2));