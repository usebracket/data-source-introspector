import { Client as PostgresClient } from 'pg';
import { PostgresConnectionDetails, PostgresIntrospectionDetails } from './postgres/types';

export abstract class DataSourceIntrospector {
  protected abstract client: PostgresClient;
  public abstract init(connectionDetails: PostgresConnectionDetails): Promise<this>;

  public abstract introspect(introspectionDetails: PostgresIntrospectionDetails): Promise<unknown>;

  public abstract destroy(): Promise<void>;
}
