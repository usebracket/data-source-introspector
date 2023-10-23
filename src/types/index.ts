type JSTypes = 'undefined' | 'object' | 'boolean' | 'number' | 'bigint' | 'string' | 'symbol' | 'function';

export type Field = {
  name: string;
  value: unknown;
  dataSourceType: any;
  jsType: JSTypes;
};
