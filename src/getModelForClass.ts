import * as mongoose from 'mongoose';
import type {
  AnyParamConstructor,
  IModelOptions,
  ReturnModelType
} from './types';
import { assertionIsClass, getName, mergeMetadata } from './internal/utils';
import { models } from './internal/data';
import { buildSchema } from './buildSchema';
import { addModelToTypegoose } from './addModelToTypegoose';
import { DecoratorKeys } from './internal/constants';

/**
 * Get a Model for a Class
 * Executes .setModelForClass if it can't find it already
 * @param cl The uninitialized Class
 * @returns The Model
 * @public
 * @example
 * ```ts
 * class Name {}
 *
 * const NameModel = getModelForClass(Name);
 * ```
 */
export function getModelForClass<U extends AnyParamConstructor<any>, QueryHelpers = {}>(cl: U, options?: IModelOptions) {
  assertionIsClass(cl);
  options = typeof options === 'object' ? options : {};

  const roptions: IModelOptions = mergeMetadata(DecoratorKeys.ModelOptions, options, cl);
  const name = getName(cl);

  if (models.has(name)) {
    return models.get(name) as ReturnModelType<U, QueryHelpers>;
  }

  const model =
    roptions?.existingConnection?.model.bind(roptions.existingConnection) ??
    roptions?.existingMongoose?.model.bind(roptions.existingMongoose) ??
    mongoose.model.bind(mongoose);

  const compiledmodel: mongoose.Model<any> = model(name, buildSchema(cl, roptions.schemaOptions));
  const refetchedOptions = (Reflect.getMetadata(DecoratorKeys.ModelOptions, cl) as IModelOptions) ?? {};

  if (refetchedOptions?.options?.runSyncIndexes) {
    // no async/await, to wait for execution on connection in the background
    compiledmodel.syncIndexes();
  }

  return addModelToTypegoose<U, QueryHelpers>(compiledmodel, cl);
}
