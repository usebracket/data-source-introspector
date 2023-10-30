import { ClientConfig } from 'pg';
import { IntrospectionDepth } from '../../types';

export type PostgresIntrospectionDetails = Partial<{
  table: string;
  schema: string;
  query: string;
}> & IntrospectionDepth;

export type PostgresConnectionDetails = Omit<ClientConfig, 'stream'>;
