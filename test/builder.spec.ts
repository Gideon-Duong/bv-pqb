import queryString from 'query-string';
import { expect } from 'chai';
import { QueryBuilder } from '../src';
// import { QueryBuilder } from 'bv-pqb';

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
  /** Filter */
  describe('Where', () => {
    it('Test with single field', () => {
      const search = `?name=John`;
      const parsed = queryString.parse(search);
      const prismaQuery = QueryBuilder(parsed);
      expect(prismaQuery).to.deep.equal({
        where: {
          name: 'John',
        },
        skip: 0,
        take: 10,
      });
    });
    it('Test with single field with operator', () => {
      const search = `?age__gte=10`;
      const parsed = queryString.parse(search);
      const prismaQuery = QueryBuilder(parsed);
      expect(prismaQuery).to.deep.equal({
        where: {
          age: { gte: 10 },
        },
        skip: 0,
        take: 10,
      });
    });
    it('Test with combine single field & single field with operator', () => {
      const search = `?name=John&age__gte=10`;
      const parsed = queryString.parse(search);
      const prismaQuery = QueryBuilder(parsed);
      expect(prismaQuery).to.deep.equal({
        where: {
          name: 'John',
          age: { gte: 10 },
        },
        skip: 0,
        take: 10,
      });
    });
    it('Test with nested field', () => {
      const search = `?contact.name=Teddy`;
      const parsed = queryString.parse(search);
      const prismaQuery = QueryBuilder(parsed);
      expect(prismaQuery).to.deep.equal({
        where: {
          contact: {
            name: 'Teddy',
          }
        },
        skip: 0,
        take: 10,
      });
    });
    it('Test with nested field with operator', () => {
      const search = `?contact.age__lte=10`;
      const parsed = queryString.parse(search);
      const prismaQuery = QueryBuilder(parsed);
      expect(prismaQuery).to.deep.equal({
        where: {
          contact: {
            age: { lte: 10 },
          }
        },
        skip: 0,
        take: 10,
      });
    });
    it('Test with combine nested field & nested field with operator', () => {
      const search = `?contact.name=Teddy&contact.age__lte=10`;
      const parsed = queryString.parse(search);
      const prismaQuery = QueryBuilder(parsed);
      expect(prismaQuery).to.deep.equal({
        where: {
          contact: {
            name: 'Teddy',
            age: { lte: 10 },
          }
        },
        skip: 0,
        take: 10,
      });
    });
    it('Test with OR/nested field/operator', () => {
      const search = `?or[0].email=john@example.com&or[1].contact.age__gte=18`;
      const parsed = queryString.parse(search);
      const prismaQuery = QueryBuilder(parsed);
      expect(prismaQuery).to.deep.equal({
        where: {
          OR: [
            { email: 'john@example.com' },
            { contact: { age: { gte: 18 } } }
          ]
        },
        skip: 0,
        take: 10,
      });
    });
    it('Test with OR/AND/nested field/operator', () => {
      const search = `?or[0].email=john@example.com&or[1].contact.age__gte=18&and[0].isActive=true`;
      const parsed = queryString.parse(search);
      const prismaQuery = QueryBuilder(parsed);
      expect(prismaQuery).to.deep.equal({
        where: {
          OR: [
            { email: 'john@example.com' },
            { contact: { age: { gte: 18 } } }
          ],
          AND: [
            { isActive: true }
          ]
        },
        skip: 0,
        take: 10,
      });
    });
    it('Test with OR/AND/nested field/operator recursive', () => {
      const search = `?or[0].email=john@example.com&or[0].and[0].isActive=true&or[0].and[1].age__gte=18&or[1].email=jane@example.com`;
      const parsed = queryString.parse(search);
      const prismaQuery = QueryBuilder(parsed);
      expect(prismaQuery).to.deep.equal({
        where: {
          OR: [
            {
              email: 'john@example.com',
              AND: [
                { isActive: true },
                { age: { gte: 18 } }
              ]
            },
            {
              email: 'jane@example.com'
            }
          ]
        },
        skip: 0,
        take: 10,
      });
    });
  });
});