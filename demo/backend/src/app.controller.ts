import { Controller, Get, Query } from '@nestjs/common';
import { QueryBuilder } from 'bv-pqb';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  main(@Query() query: Record<string, any>): Record<string, any> {
    const builder = QueryBuilder(query);
    return builder;
  }
}
