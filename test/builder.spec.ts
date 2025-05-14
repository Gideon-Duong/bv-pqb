import queryString from 'query-string';
import { expect } from 'chai';
import { QueryBuilder } from '../src'

describe('Prisma Query Builder', () => {
  /** Pagination */
  describe('Pagination', () => {
    it('Test with only page', () => {
      const page = 1;
      const search = `?page=${page}`;
      const parsed = queryString.parse(search);
      const prismaQuery = QueryBuilder(parsed);
      expect(prismaQuery).to.deep.equal({
        skip: (page - 1) * 10,
        take: 10,
      });
    });

    it('Test with only take', () => {
      const limit = 10;
      const search = `?take=${limit}`;
      const parsed = queryString.parse(search);
      const prismaQuery = QueryBuilder(parsed);
      expect(prismaQuery).to.deep.equal({
        skip: 0,
        take: limit,
      });
    });

    it('Test with combine take and page', () => {
      const limit = 10;
      const page = 2;
      const search = `?take=${limit}&page=${page}`;
      const parsed = queryString.parse(search);
      const prismaQuery = QueryBuilder(parsed);
      expect(prismaQuery).to.deep.equal({
        skip: (page - 1) * 10,
        take: limit,
      });
    });
  });
  /** Sorting */
  describe('Sorting', () => {
    it('Test with single field', () => {
      const search = `?sort=id`;
      const parsed = queryString.parse(search);
      const prismaQuery = QueryBuilder(parsed);
      expect(prismaQuery).to.deep.equal({
        orderBy: [{
          id: 'asc',
        }],
        skip: 0,
        take: 10,
      });
    });

    it('Test with multiple field', () => {
      const search = `?sort=id,-name`;
      const parsed = queryString.parse(search);
      const prismaQuery = QueryBuilder(parsed);
      expect(prismaQuery).to.deep.equal({
        orderBy: [
          { id: 'asc' },
          { name: 'desc' },
        ],
        skip: 0,
        take: 10,
      });
    });

    it('Test with multiple field and has nested field', () => {
      const search = `?sort=id,-name,user.name`;
      const parsed = queryString.parse(search);
      const prismaQuery = QueryBuilder(parsed);
      expect(prismaQuery).to.deep.equal({
        orderBy: [
          { id: 'asc' },
          { name: 'desc' },
          { user: { name: 'asc' } },
        ],
        skip: 0,
        take: 10,
      });
    });
  });
});