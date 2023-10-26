import { FieldDef, Client as PostgresClient } from 'pg';
import { DataSourceIntrospector } from '../data-source-introspector';
import { PostgresConnectionDetails, PostgresIntrospectionDetails } from './types';
import { parseSchema } from '../../utils';
import { DEFAULT_INTROSPECTION_DEPTH } from '../../constants';

export class PostgresIntrospector extends DataSourceIntrospector {
  protected client!: PostgresClient;

  static addLimitToQuery({ query, limit = 100 }: { query: string, limit?: number }) {
    const extraQueryWithSemicolon = !/;\s*$/.test(query)
      ? `${query};`
      : query;

    return extraQueryWithSemicolon.match(/[Ll][Ii][Mm][Ii][Tt]\s+\d+/)
      ? extraQueryWithSemicolon.trim().replace(/[Ll][Ii][Mm][Ii][Tt]\s+\d+/, ` LIMIT ${limit}`)
      : extraQueryWithSemicolon.trim().slice(0, -1).concat(` LIMIT ${limit};`);
  }

  static mapFields({ fields, rows }: { fields: FieldDef[], rows: any[] }) {
    return {
      schema: parseSchema(rows),
      dataSourceType: fields.reduce((acc, field) => {
        acc[field.name] = field.dataTypeID;

        return acc;
      }, {} as Record<string, unknown>),
    };
  }

  async init(pgConnectionDetails: PostgresConnectionDetails) {
    const pgClient = new PostgresClient(pgConnectionDetails);
    await pgClient.connect();

    this.client = pgClient;

    return this;
  }

  async introspect({
    table, schema,
    query: customQuery,
    introspectionDepth = DEFAULT_INTROSPECTION_DEPTH,
  }: PostgresIntrospectionDetails) {
    try {
      if (customQuery) {
        const {
          fields,
          rows,
        } = await this.client.query(PostgresIntrospector.addLimitToQuery({
          query: customQuery,
          limit: introspectionDepth,
        }));

        return PostgresIntrospector.mapFields({ fields, rows });
      }

      const schemaString = schema ? `${schema}.` : '';
      const query = `SELECT * FROM ${schemaString}"${table}"`;

      const {
        fields,
        rows,
      } = await this.client.query(PostgresIntrospector.addLimitToQuery({
        query,
        limit: introspectionDepth,
      }));

      return PostgresIntrospector.mapFields({ fields, rows });
    } catch (error) {
      throw new Error(`Error fetching fields for table ${table} with error: ${error}`);
    }
  }

  async destroy() {
    await this.client.end();
  }
}
