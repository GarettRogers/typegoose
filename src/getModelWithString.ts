import { assertion } from './internal/utils';
import type {
  AnyParamConstructor,
  ReturnModelType
} from './types';
import { models } from './internal/data';

/**
 * Get Model from internal cache
 * @param key ModelName key
 * @example
 * ```ts
 * class Name {}
 * getModelForClass(Name); // build the model
 * const NameModel = getModelWithString<typeof Name>("Name");
 * ```
 */
export function getModelWithString<U extends AnyParamConstructor<any>>(key: string): undefined | ReturnModelType<U> {
  assertion(typeof key === 'string', TypeError(`Expected "key" to be a string, got "${key}"`));

  return models.get(key) as any;
}
