import queryString from "query-string";
import { expect } from "chai";
import { QueryBuilder } from "../src";

describe("Prisma Query Builder (Select)", () => {
  it("Test with single field", () => {
    const search = `?select=name`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      select: {
        name: true,
      },
      skip: 0,
      take: 10,
    });
  });
  it("Test with nested field", () => {
    const search = `?select=contact.name`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      select: {
        contact: {
          select: { name: true },
        },
      },
      skip: 0,
      take: 10,
    });
  });
  it("Test with combine field and nested field", () => {
    const search = `?select=name,contact.name`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      select: {
        name: true,
        contact: {
          select: { name: true },
        },
      },
      skip: 0,
      take: 10,
    });
  });
  it("Test with query nested field", () => {
    const search = `?select=contact.name,contact.query(take=2|page=1|sort=name,-createAt)`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      select: {
        contact: {
          take: 2,
          skip: 0,
          orderBy: [{ name: "asc" }, { createAt: "desc" }],
          select: { name: true },
        },
      },
      skip: 0,
      take: 10,
    });
  });
});