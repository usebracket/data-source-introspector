import { Client as PostgresClient } from 'pg';
import { DataSourceIntrospector } from '../data-source-introspector';
import { PostgresConnectionDetails, PostgresIntrospectionDetails } from './types';
import { parseFieldsDefinition } from '../../utils';
import { DEFAULT_INTROSPECTION_RECORD_SAMPLE_SIZE } from '../../constants';
import { DataSourceFields } from '../../types';

export class PostgresIntrospector extends DataSourceIntrospector {
  protected client!: PostgresClient;

  static addLimitToQuery({
    query,
    limit = DEFAULT_INTROSPECTION_RECORD_SAMPLE_SIZE,
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
      fields: parseFieldsDefinition({ fields, rows }),
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
    sampleSize = DEFAULT_INTROSPECTION_RECORD_SAMPLE_SIZE,
  }: PostgresIntrospectionDetails) {
    try {
      if (customQuery) {
        const {
          fields,
          rows,
        } = await this.client.query(PostgresIntrospector.addLimitToQuery({
          query: customQuery,
          limit: sampleSize,
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
        limit: sampleSize,
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
