import { ClientConfig } from 'pg';

export type PostgresIntrospectionDetails = Partial<{
  table: string;
  schema: string;
  query: string;
}>;

export type PostgresConnectionDetails = Omit<ClientConfig, 'stream'>;
