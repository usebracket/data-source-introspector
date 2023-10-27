import {
  isNull, isDate, isObject, isArray,
} from 'lodash';
import { BracketType, BracketTypes } from '../types';

const getArraySchema = (arrToIntrospect: Array<any>) => {
  const arr = {
    type: BracketTypes.ARRAY,
    items: arrToIntrospect,
  };

  return arr;
};

const getObjectSchema = (objToIntrospect: Record<string, any>) => {
  const obj = {
    type: BracketTypes.OBJECT,
    properties: {} as Record<keyof typeof objToIntrospect, unknown>,
  };

  Object.entries(objToIntrospect).forEach(([key, value]) => {
    if (isNull(value)) {
      obj.properties[key] = BracketTypes.NULL;
      return;
    }

    if (isDate(value)) {
      obj.properties[key] = BracketTypes.DATE;
      return;
    }

    if (isArray(value)) {
      obj.properties[key] = getArraySchema(value);
      return;
    }

    if (isObject(value)) {
      obj.properties[key] = getObjectSchema(value);
      return;
    }

    obj.properties[key] = typeof value;
  });

  return obj;
};

export const parseSchema = (arrToIntrospect: Array<Record<string, any>>) => {
  const map = new Map<string, number>();

  arrToIntrospect.forEach((item) => {
    const obj = getObjectSchema(item);

    const key = JSON.stringify(obj);
    const value = map.get(key);

    if (value) {
      map.set(key, value + 1);
    } else {
      map.set(key, 1);
    }
  });

  const result: BracketType[] = [];

  map.forEach((value, key) => {
    result.push({
      ...JSON.parse(key),
      probability: (100 * value) / arrToIntrospect.length,
    });
  });

  return result.toSorted((a, b) => b.probability - a.probability);
};
