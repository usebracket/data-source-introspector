import { DataSourceClient, DataSourceConnectionDetails, DataSourceIntrospectDetails } from './types';
import { IntrospectionResult } from '../types';

export abstract class DataSourceIntrospector {
  protected abstract client: DataSourceClient;
  public abstract init(connectionDetails: DataSourceConnectionDetails): Promise<this>;

  public abstract introspect(
    introspectionDetails: DataSourceIntrospectDetails
  ): Promise<IntrospectionResult>;

  public abstract destroy(): Promise<void>;
}
