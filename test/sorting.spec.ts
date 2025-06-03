import queryString from "query-string";
import { expect } from "chai";
import { QueryBuilder } from "../src";

describe("Prisma Query Builder (Sorting)", () => {
  it("Test with single field", () => {
    const search = `?sort=id`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      orderBy: [
        {
          id: "asc",
        },
      ],
      skip: 0,
      take: 10,
    });
  });

  it("Test with multiple field", () => {
    const search = `?sort=id,-name`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      orderBy: [{ id: "asc" }, { name: "desc" }],
      skip: 0,
      take: 10,
    });
  });

  it("Test with multiple field and has nested field", () => {
    const search = `?sort=id,-name,user.name`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      orderBy: [{ id: "asc" }, { name: "desc" }, { user: { name: "asc" } }],
      skip: 0,
      take: 10,
    });
  });
});