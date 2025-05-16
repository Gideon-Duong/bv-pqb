import { prisma } from '@/lib/prisma';
import { QueryBuilder } from 'bv-pqb';

export async function POST(request: Request) {
  const body = await request.json()
  const builder = QueryBuilder(body.query)
  const data = await (prisma[body.collection] as any).findMany({
    ...builder?.orderBy && {
      orderBy: builder.orderBy
    },
    skip: builder.skip,
    take: builder.take,
  })
  return Response.json({
    builder,
    data
  })
}
