import queryString from 'query-string';
import { QueryBuilder } from '../src'

const search = '?select=userId,id,board,contacts,contacts.take(3),contacts.select(id,event.id,event.name)';
const parsed = queryString.parse(search);
console.log('parsed', JSON.stringify(parsed, null, 2));

const builder = new QueryBuilder();
const prismaQuery = builder.build(parsed);
console.log(JSON.stringify(prismaQuery, null, 2));