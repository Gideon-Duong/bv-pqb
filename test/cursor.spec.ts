import queryString from "query-string";
import { expect } from "chai";
import { QueryBuilder } from "../src";

describe("Prisma Query Builder (Cursor)", () => {
  it("Test with single field", () => {
    const search = `?cursor=id:1`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      cursor: {
        id: 1,
      },
      take: 10,
    });
  });

  it("Test with nested field", () => {
    const search = `?cursor=category.id:1`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      cursor: {
        category: {
          id: 1,
        }
      },
      take: 10,
    });
  });

  it("Test with combine single field & nested field", () => {
    const search = `?cursor=id:1,category.id:2`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      cursor: {
        id: 1,
        category: {
          id: 2,
        }
      },
      take: 10,
    });
  });

  it("Test with and & or", () => {
    const search = `?cursor=or[0].email:john@example.com,or[0].and[0].isActive:true,or[0].and[1].age:18,or[1].email:jane@example.com`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      cursor: {
        OR: [
          {
            email: "john@example.com",
            AND: [{ isActive: true }, { age: 18 }],
          },
          {
            email: "jane@example.com",
          },
        ]
      },
      take: 10,
    });
  });
});
