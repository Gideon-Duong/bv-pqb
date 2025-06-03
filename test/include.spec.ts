import queryString from "query-string";
import { expect } from "chai";
import { QueryBuilder } from "../src";

describe("Prisma Query Builder (Include)", () => {
  it("Test with single field", () => {
    const search = `?include=contacts`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      include: {
        contacts: true,
      },
      skip: 0,
      take: 10,
    });
  });
  it("Test with nested field", () => {
    const search = `?include=contacts,category.events`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      include: {
        contacts: true,
        category: {
          include: {
            events: true,
          },
        },
      },
      skip: 0,
      take: 10,
    });
  });
  it("Test with select in include", () => {
    const search = `?include=contacts.query(select=id,name,phone|page=2|take=20|sort=id,-createdAt),category.events`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      include: {
        contacts: {
          take: 20,
          skip: 20,
          orderBy: [{ id: "asc" }, { createdAt: "desc" }],
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        category: {
          include: {
            events: true,
          },
        },
      },
      skip: 0,
      take: 10,
    });
  });
});