import * as mongoose from 'mongoose';
import { assertion, assertionIsClass, getName } from './internal/utils';
import type {
  AnyParamConstructor,
  ReturnModelType
} from './types';
import { constructors, models } from './internal/data';
import { logger } from './logSettings';

/**
 * This can be used to add custom Models to Typegoose, with the type information of cl
 * Note: no gurantee that the type information is fully correct
 * @param model The model to store
 * @param cl The Class to store
 * @example
 * ```ts
 * class Name {}
 *
 * const schema = buildSchema(Name);
 * // modifications to the schame can be done
 * const model = addModelToTypegoose(mongoose.model("Name", schema), Name);
 * ```
 */
export function addModelToTypegoose<U extends AnyParamConstructor<any>, QueryHelpers = {}>(model: mongoose.Model<any>, cl: U) {
  assertion(model.prototype instanceof mongoose.Model, new TypeError(`"${model}" is not a valid Model!`));
  assertionIsClass(cl);

  const name = getName(cl);

  assertion(
    !models.has(name),
    new Error(
      'It seems like "addModelToTypegoose" got called twice\n' +
      'Or multiple classes with the same name are used, which is not supported!' +
      `(Model Name: "${name}") [E003]`
    )
  );

  if (constructors.get(name)) {
    logger.info('Class "%s" already existed in the constructors Map', name);
  }

  models.set(name, model);
  constructors.set(name, cl);

  return models.get(name) as ReturnModelType<U, QueryHelpers>;
}
