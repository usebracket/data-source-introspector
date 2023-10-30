import {
  isNull, isDate, isObject, isArray,
  isUndefined, isNumber, isString, isBoolean,
} from 'lodash';
import {
  BracketTypes, DataSourceFields, PropertyDescription, TypeDescription,
} from '../types';

const getBracketType = (val: unknown): BracketTypes => {
  if (isArray(val)) {
    return BracketTypes.ARRAY;
  }

  if (isDate(val)) {
    return BracketTypes.DATE;
  }

  if (isNull(val)) {
    return BracketTypes.NULL;
  }

  if (isObject(val)) {
    return BracketTypes.OBJECT;
  }

  if (isNumber(val)) {
    return BracketTypes.NUMBER;
  }

  if (isString(val)) {
    return BracketTypes.STRING;
  }

  if (isBoolean(val)) {
    return BracketTypes.BOOLEAN;
  }

  return BracketTypes.UNDEFINED;
};

export const parseSchema = ({
  fields,
  rows,
}: { fields: DataSourceFields[], rows: Array<Record<string, any>> }) => {
  const [fistItem] = rows;

  if (!fistItem) {
    throw new Error('Array can not be empty');
  }

  const schema = Object.fromEntries<any[]>(
    Object.entries<typeof fistItem>(fistItem).map(([key]) => [key, []]),
  );

  rows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      const value = row[key];
      schema[key].push(value);
    });
  });

  const result = new Map<string, PropertyDescription>();

  Object.entries(schema).forEach(([key, value]) => {
    const nonUndefinedValuesCount = value.filter((item) => !isUndefined(item)).length;
    const hasDuplicates = new Set(value).size !== value.length;
    const probability = nonUndefinedValuesCount / rows.length;
    const nullProbability = value.filter((item) => isNull(item)).length / value.length;

    const typeMap = new Map<BracketTypes, number>();
    value.forEach((item) => {
      const type = getBracketType(item);
      const count = typeMap.get(type);

      if (count) {
        typeMap.set(type, count + 1);
      } else {
        typeMap.set(type, 1);
      }
    });

    const mappedTypes: TypeDescription[] = [];

    typeMap.forEach((uniqueTypesCount, type) => {
      const values = value.filter((item) => getBracketType(item) === type);

      mappedTypes.push({
        count: uniqueTypesCount,
        probability: uniqueTypesCount / value.length,
        unique: new Set(values).size,
        values,
        type,
      });
    });

    result.set(key, {
      count: nonUndefinedValuesCount,
      dataSourceType: fields.find((field) => field.name === key)?.type,
      hasDuplicates,
      probability,
      nullProbability,
      types: mappedTypes,
    });
  });

  return result;
};
