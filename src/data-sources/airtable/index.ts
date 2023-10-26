import axios, { AxiosInstance } from 'axios';
import { DataSourceIntrospector } from '../data-source-introspector';
import {
  AirtableConnectionDetails, AirtableIntrospectionDetails,
  AirtableField, AirtableRecord, AirtableTable,
} from './types';
import { Field } from '../../types';

export class AirtableIntrospector extends DataSourceIntrospector {
  protected client!: AxiosInstance;

  static mapFields({
    fields, record: { fields: record },
  }: { fields: AirtableField[], record: AirtableRecord }): Field[] {
    return fields.map((field) => ({
      name: field.name,
      jsType: typeof record[field.name],
      value: record[field.name],
      dataSourceType: field.type,
    }));
  }

  async init({ auth }: AirtableConnectionDetails) {
    this.client = axios.create({
      baseURL: 'https://api.airtable.com/v0',
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    });

    return this;
  }

  async introspect({ baseId, tableId }: AirtableIntrospectionDetails) {
    const {
      data: {
        tables,
      },
    } = await this.client.get<{ tables: AirtableTable[] }>(`/meta/bases/${baseId}/tables`);

    const table = tables.find(({ id }) => id === tableId);
    if (!table) {
      throw new Error(`Table w/ id: ${tableId} doesn't exist for base: ${baseId}`);
    }

    const {
      data: {
        records: [record],
      },
    } = await this.client.get<{ records: AirtableRecord[] }>(`/${baseId}/${tableId}`, {
      headers: {
        maxRecords: 1,
      },
    });

    return AirtableIntrospector.mapFields({
      fields: table.fields,
      record,
    });
  }

  async destroy() {
    // @ts-expect-error
    delete this.client;
  }
}
