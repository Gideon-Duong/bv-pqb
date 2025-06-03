import queryString from "query-string";
import { expect } from "chai";
import { QueryBuilder } from "../src";

describe("Prisma Query Builder (Pagination)", () => {
  it("Test with only page", () => {
    const page = 1;
    const search = `?page=${page}`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      skip: (page - 1) * 10,
      take: 10,
    });
  });

  it("Test with only take", () => {
    const limit = 10;
    const search = `?take=${limit}`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      skip: 0,
      take: limit,
    });
  });

  it("Test with combine take and page", () => {
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