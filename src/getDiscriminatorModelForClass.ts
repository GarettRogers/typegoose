import * as mongoose from 'mongoose';
import { assertion, assertionIsClass, getName } from './internal/utils';
import type {
  AnyParamConstructor,
  ReturnModelType
} from './types';
import { models } from './internal/data';
import { isModel } from './typeguards';
import { buildSchema } from './buildSchema';
import { addModelToTypegoose } from './addModelToTypegoose';

/**
 * Build a Model from a given class and return the model
 * @param from The Model to build From
 * @param cl The Class to make a model out
 * @param value The Identifier to use to differentiate documents (default: cl.name)
 * @example
 * ```ts
 * class C1 {}
 * class C2 extends C1 {}
 *
 * const C1Model = getModelForClass(C1);
 * const C2Model = getDiscriminatorModelForClass(C1Model, C1);
 * ```
 */
export function getDiscriminatorModelForClass<U extends AnyParamConstructor<any>, QueryHelpers = {}>(
  from: mongoose.Model<any>,
  cl: U,
  value?: string
) {
  assertion(isModel(from), new TypeError(`"${from}" is not a valid Model!`));
  assertionIsClass(cl);

  const name = getName(cl);
  if (models.has(name)) {
    return models.get(name) as ReturnModelType<U, QueryHelpers>;
  }

  const sch = buildSchema(cl) as mongoose.Schema & { paths: any; };

  const discriminatorKey = sch.get('discriminatorKey');
  if (sch.path(discriminatorKey)) {
    (sch.paths[discriminatorKey] as any).options.$skipDiscriminatorCheck = true;
  }

  const model = from.discriminator(name, sch, value ? value : name);

  return addModelToTypegoose<U, QueryHelpers>(model, cl);
}
