type JSTypes = 'undefined' | 'object' | 'boolean' | 'number' | 'bigint' | 'string' | 'symbol' | 'function';
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

type Probability = {
  probability: number;
};
type BracketPrimitives = {
  type: Omit<JSTypes, 'symbol' | 'function'> | 'object'
} & Probability;
type BracketArray = {
  type: BracketTypes.ARRAY;
  itemsType: Array<BracketType>;
} & Probability;
type BracketObjectProps = {
  type: BracketTypes;
  required?: boolean;
  properties?: Record<string, BracketObjectProps>;
} & Probability;
type BracketObject = {
  type: BracketTypes.OBJECT;
  properties: Record<string, BracketObjectProps>;
} & Probability;
export type BracketType = BracketPrimitives | BracketArray | BracketObject;

export type IntrospectionResult = {
  dataSourceType: Record<string, unknown>;
  schema: BracketType[];
};
