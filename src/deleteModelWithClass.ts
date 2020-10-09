import { assertionIsClass, getName } from './internal/utils';
import type {
  AnyParamConstructor
} from './types';
import { deleteModel } from './deleteModel';

/**
 * Delete a model, with the given class
 * Same as "deleteModel", only that it can be done with the class instead of the name
 * @param cl The Class
 * @example
 * ```ts
 * class Name {}
 * const NameModel = getModelForClass(Name);
 * deleteModelWithClass(Name);
 * ```
 */
export function deleteModelWithClass<U extends AnyParamConstructor<any>>(cl: U) {
  assertionIsClass(cl);

  return deleteModel(getName(cl));
}
