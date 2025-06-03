import queryString from "query-string";
import { expect } from "chai";
import { QueryBuilder } from "../src";

describe("Prisma Query Builder (Where)", () => {
  it("Test with single field", () => {
    const search = `?name=John`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      where: {
        name: "John",
      },
      skip: 0,
      take: 10,
    });
  });
  it("Test with single field with operator", () => {
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
  it("Test with combine single field & single field with operator", () => {
    const search = `?name=John&age__gte=10`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      where: {
        name: "John",
        age: { gte: 10 },
      },
      skip: 0,
      take: 10,
    });
  });
  it("Test with nested field", () => {
    const search = `?contact.name=Teddy`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      where: {
        contact: {
          name: "Teddy",
        },
      },
      skip: 0,
      take: 10,
    });
  });
  it("Test with nested field with operator", () => {
    const search = `?contact.age__lte=10`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      where: {
        contact: {
          age: { lte: 10 },
        },
      },
      skip: 0,
      take: 10,
    });
  });
  it("Test with combine nested field & nested field with operator", () => {
    const search = `?contact.name=Teddy&contact.age__lte=10`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      where: {
        contact: {
          name: "Teddy",
          age: { lte: 10 },
        },
      },
      skip: 0,
      take: 10,
    });
  });
  it("Test with OR/nested field/operator", () => {
    const search = `?or[0].email=john@example.com&or[1].contact.age__gte=18`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      where: {
        OR: [
          { email: "john@example.com" },
          { contact: { age: { gte: 18 } } },
        ],
      },
      skip: 0,
      take: 10,
    });
  });
  it("Test with OR/AND/nested field/operator", () => {
    const search = `?or[0].email=john@example.com&or[1].contact.age__gte=18&and[0].isActive=true`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      where: {
        OR: [
          { email: "john@example.com" },
          { contact: { age: { gte: 18 } } },
        ],
        AND: [{ isActive: true }],
      },
      skip: 0,
      take: 10,
    });
  });
  it("Test with OR/AND/nested field/operator recursive", () => {
    const search = `?or[0].email=john@example.com&or[0].and[0].isActive=true&or[0].and[1].age__gte=18&or[1].email=jane@example.com`;
    const parsed = queryString.parse(search);
    const prismaQuery = QueryBuilder(parsed);
    expect(prismaQuery).to.deep.equal({
      where: {
        OR: [
          {
            email: "john@example.com",
            AND: [{ isActive: true }, { age: { gte: 18 } }],
          },
          {
            email: "jane@example.com",
          },
        ],
      },
      skip: 0,
      take: 10,
    });
  });
});