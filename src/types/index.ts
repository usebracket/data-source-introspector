type JSTypes = 'undefined' | 'object' | 'boolean' | 'number' | 'bigint' | 'string' | 'symbol' | 'function';
type BracketTypes = Omit<JSTypes, 'symbol' | 'function'> | 'array';
type Probability = {
  probability: number;
};
type BracketPrimitives = {
  type: Omit<JSTypes, 'symbol' | 'function'> | 'object'
} & Probability;
type BracketArray = {
  type: 'array';
  itemsType: Array<BracketType>;
} & Probability;
type BracketObjectProps = {
  type: BracketTypes;
  required?: boolean;
  properties?: Record<string, BracketObjectProps>;
} & Probability;
type BracketObject = {
  type: 'object';
  properties: Record<string, BracketObjectProps>;
} & Probability;
export type BracketType = BracketPrimitives | BracketArray | BracketObject;

export type IntrospectionResult = {
  dataSourceType: Record<string, unknown>;
  schema: BracketType[];
};
