import { BracketType } from '../types';

export const parseSchema = (arr: Array<Record<string, unknown>>) => {
  const map = new Map<string, number>();

  arr.forEach((item) => {
    const obj = {
      type: 'object',
      properties: {} as Record<keyof typeof item, unknown>,
    };

    Object.entries(item).forEach(([key, value]) => {
      obj.properties[key] = typeof value;
    });

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
      probability: (100 * value) / arr.length,
    });
  });

  return result.toSorted((a, b) => b.probability - a.probability);
};
