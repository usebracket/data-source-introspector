import { Client as PostgresClient } from 'pg';
import { DataSourceIntrospector } from '../data-source-introspector';
import { PostgresConnectionDetails, PostgresIntrospectionDetails } from './types';
import { parseSchema } from '../../utils';
import { DEFAULT_INTROSPECTION_DEPTH } from '../../constants';
import { DataSourceFields } from '../../types';

export class PostgresIntrospector extends DataSourceIntrospector {
  protected client!: PostgresClient;

  static addLimitToQuery({
    query,
    limit = DEFAULT_INTROSPECTION_DEPTH,
  }: { query: string, limit?: number }) {
    const extraQueryWithSemicolon = !/;\s*$/.test(query)
      ? `${query};`
      : query;

    return extraQueryWithSemicolon.match(/[Ll][Ii][Mm][Ii][Tt]\s+\d+/)
      ? extraQueryWithSemicolon.trim().replace(/[Ll][Ii][Mm][Ii][Tt]\s+\d+/, ` LIMIT ${limit}`)
      : extraQueryWithSemicolon.trim().slice(0, -1).concat(` LIMIT ${limit};`);
  }

  static mapFields({
    fields,
    rows,
  }: { fields: DataSourceFields[], rows: Record<string, unknown>[] }) {
    return {
      fields: parseSchema({ fields, rows }),
    };
  }

  async init(pgConnectionDetails: PostgresConnectionDetails) {
    const pgClient = new PostgresClient(pgConnectionDetails);
    await pgClient.connect();

    this.client = pgClient;
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

        return PostgresIntrospector.mapFields({
          fields: fields.map((f) => ({
            name: f.name,
            type: f.dataTypeID,
          })),
          rows,
        });
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

      return PostgresIntrospector.mapFields({
        fields: fields.map((f) => ({
          name: f.name,
          type: f.dataTypeID,
        })),
        rows,
      });
    } catch (error) {
      throw new Error(`Error fetching fields for table ${table} with error: ${error}`);
    }
  }

  async destroy() {
    await this.client.end();
  }
}
