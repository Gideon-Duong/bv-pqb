import queryString from "query-string";
import { expect } from "chai";
import { QueryBuilder } from "../src";

describe("Prisma Query Builder (Omit)", () => {
  it("Test with single field", () => {
    const page = 1;
    const search = `?omit=id`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      omit: {
        id: true,
      },
      skip: (page - 1) * 10,
      take: 10,
    });
  });

  it("Test with nested field", () => {
    const page = 1;
    const search = `?omit=contact.email`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      omit: {
        contact: {
          email: true,
        }
      },
      skip: (page - 1) * 10,
      take: 10,
    });
  });

    it("Test with combine single field & nested field", () => {
    const page = 1;
    const search = `?omit=id,contact.email`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      omit: {
        id: true,
        contact: {
          email: true,
        }
      },
      skip: (page - 1) * 10,
      take: 10,
    });
  });
});