import { QueryBuilder } from "bv-pqb";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const builder = QueryBuilder(body.query);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await (prisma[body.collection] as any).findMany({
    ...(builder?.orderBy && {
      orderBy: builder.orderBy,
    }),
    ...(builder?.where && {
      where: builder.where,
    }),
    ...(builder?.select && {
      select: builder.select,
    }),
    ...(builder?.include && {
      include: builder.include,
    }),
    skip: builder.skip,
    take: builder.take,
  });
  return Response.json({
    builder,
    data,
  });
}
