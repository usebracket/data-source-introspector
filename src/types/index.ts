export enum BracketTypes {
  UNDEFINED = 'undefined',
  OBJECT = 'object',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  BIGINT = 'bigint',
  STRING = 'string',
  ARRAY = 'ARRAY',
  NULL = 'null',
  DATE = 'date',
}

export type TypeDescription = {
  probability: number,
  unique: number,
  values: unknown[],
  type: BracketTypes,
  count: number
};

export type PropertyDescription = {
  count: number;
  dataSourceType: unknown;
  hasDuplicates: boolean;
  probability: number;
  nullProbability: number;
  types: TypeDescription[],
};

export type IntrospectionResult = {
  fields: Map<string, PropertyDescription>;
};

export type DataSourceFields = {
  name: string;
  type: unknown;
};

export type IntrospectionDepth = {
  introspectionDepth?: number;
};
