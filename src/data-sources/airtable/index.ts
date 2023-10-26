import axios, { AxiosInstance } from 'axios';
import { DataSourceIntrospector } from '../data-source-introspector';
import {
  AirtableConnectionDetails, AirtableIntrospectionDetails,
  AirtableField, AirtableRecord, AirtableTable,
} from './types';
import { parseSchema } from '../../utils';
import { DEFAULT_INTROSPECTION_DEPTH } from '../../constants';

export class AirtableIntrospector extends DataSourceIntrospector {
  protected client!: AxiosInstance;

  static mapFields({ fields, records }: { fields: AirtableField[], records: AirtableRecord[] }) {
    return {
      schema: parseSchema(records),
      dataSourceType: fields.reduce((acc, field) => {
        acc[field.name] = field.type;

        return acc;
      }, {} as Record<string, unknown>),
    };
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

  async introspect({
    baseId,
    tableId,
    introspectionDepth = DEFAULT_INTROSPECTION_DEPTH,
  }: AirtableIntrospectionDetails) {
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
        records,
      },
    } = await this.client.get<{ records: AirtableRecord[] }>(`/${baseId}/${tableId}`, {
      headers: {
        maxRecords: introspectionDepth,
      },
    });

    return AirtableIntrospector.mapFields({
      fields: table.fields,
      records,
    });
  }

  async destroy() {
    // @ts-expect-error
    delete this.client;
  }
}
