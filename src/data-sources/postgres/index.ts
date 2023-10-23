import { FieldDef, Client as PostgresClient } from 'pg';
import { DataSourceIntrospector } from '../data-source-introspector';
import { PostgresConnectionDetails, PostgresIntrospectionDetails } from './types';
import { Field } from '../../types';

export class PostgresIntrospector extends DataSourceIntrospector {
  protected client!: PostgresClient;

  static addLimitToQuery({ query, limit = 1 }: { query: string, limit?: number }) {
    const extraQueryWithSemicolon = !/;\s*$/.test(query)
      ? `${query};`
      : query;

    return extraQueryWithSemicolon.match(/[Ll][Ii][Mm][Ii][Tt]\s+\d+/)
      ? extraQueryWithSemicolon.trim().replace(/[Ll][Ii][Mm][Ii][Tt]\s+\d+/, ` LIMIT ${limit}`)
      : extraQueryWithSemicolon.trim().slice(0, -1).concat(` LIMIT ${limit};`);
  }

  static mapFields({ fields, row }: { fields: FieldDef[], row: Record<string, unknown> }): Field[] {
    return fields.map((field) => ({
      name: field.name,
      jsType: typeof row[field.name],
      value: row[field.name],
      dataSourceType: field.dataTypeID,
    }));
  }

  async init(pgConnectionDetails: PostgresConnectionDetails) {
    const pgClient = new PostgresClient(pgConnectionDetails);
    await pgClient.connect();

    this.client = pgClient;

    return this;
  }

  async introspect(pgIntrospectionDetails: PostgresIntrospectionDetails) {
    const { table, schema, query: customQuery } = pgIntrospectionDetails;

    try {
      if (customQuery) {
        const {
          fields,
          rows: [row],
        } = await this.client.query(PostgresIntrospector.addLimitToQuery({ query: customQuery }));

        return PostgresIntrospector.mapFields({ fields, row });
      }

      const schemaString = schema ? `${schema}.` : '';
      const query = `SELECT * FROM ${schemaString}"${table}"`;

      const {
        fields,
        rows: [row],
      } = await this.client.query(PostgresIntrospector.addLimitToQuery({ query }));

      return PostgresIntrospector.mapFields({ fields, row });
    } catch (error) {
      throw new Error(`Error fetching fields for table ${table} with error: ${error}`);
    }
  }

  async destroy() {
    await this.client.end();
  }
}
