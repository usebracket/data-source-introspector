import { ClientConfig } from 'pg';
import { SampleSize } from '../../types';

export type PostgresIntrospectionDetails = Partial<{
  table: string;
  schema: string;
  query: string;
}> & SampleSize;

export type PostgresConnectionDetails = Omit<ClientConfig, 'stream'>;
