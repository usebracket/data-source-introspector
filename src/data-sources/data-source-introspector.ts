import { DataSourceClient, DataSourceConnectionDetails, DataSourceIntrospectDetails } from './types';
import { Field } from '../types';

export abstract class DataSourceIntrospector {
  protected abstract client: DataSourceClient;
  public abstract init(connectionDetails: DataSourceConnectionDetails): Promise<this>;

  public abstract introspect(introspectionDetails: DataSourceIntrospectDetails): Promise<Field[]>;

  public abstract destroy(): Promise<void>;
}
