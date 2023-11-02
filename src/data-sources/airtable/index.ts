import axios, { AxiosInstance } from 'axios';
import { DataSourceIntrospector } from '../data-source-introspector';
import {
  AirtableConnectionDetails, AirtableIntrospectionDetails,
  AirtableRecord, AirtableTable,
} from './types';
import { parseFieldsDefinition } from '../../utils';
import { DEFAULT_INTROSPECTION_RECORD_SAMPLE_SIZE } from '../../constants';
import { DataSourceFields } from '../../types';

export class AirtableIntrospector extends DataSourceIntrospector {
  protected client!: AxiosInstance;

  static mapFields({
    fields,
    rows,
  }: { fields: DataSourceFields[], rows: AirtableRecord[] }) {
    return {
      fields: parseFieldsDefinition({ fields, rows }),
    };
  }

  async init({ auth }: AirtableConnectionDetails) {
    this.client = axios.create({
      baseURL: 'https://api.airtable.com/v0',
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    });
  }

  async introspect({
    baseId,
    tableId,
    sampleSize = DEFAULT_INTROSPECTION_RECORD_SAMPLE_SIZE,
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
        records: rows,
      },
    } = await this.client.get<{ records: AirtableRecord[] }>(`/${baseId}/${tableId}`, {
      headers: {
        maxRecords: sampleSize,
      },
    });

    return AirtableIntrospector.mapFields({
      fields: table.fields.map((f) => ({
        name: f.name,
        type: f.type,
      })),
      rows,
    });
  }

  async destroy() {
    // @ts-expect-error
    delete this.client;
  }
}
