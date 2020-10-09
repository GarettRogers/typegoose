import * as mongoose from 'mongoose';
import { assertionIsClass, getName, mergeSchemaOptions } from './internal/utils';
import type {
  AnyParamConstructor
} from './types';
import { _buildSchema } from './internal/schema';
import { logger } from './logSettings';

/**
 * Generates a Mongoose schema out of class props, iterating through all parents
 * @param cl The not initialized Class
 * @returns Returns the Build Schema
 * @example
 * ```ts
 * class Name {}
 * const NameSchema = buildSchema(Name);
 * const NameModel = mongoose.model("Name", NameSchema);
 * ```
 */
export function buildSchema<U extends AnyParamConstructor<any>>(cl: U, options?: mongoose.SchemaOptions) {
  assertionIsClass(cl);

  logger.debug('buildSchema called for "%s"', getName(cl));

  const mergedOptions = mergeSchemaOptions(options, cl);

  let sch: mongoose.Schema<U>;
  /** Parent Constructor */
  let parentCtor = Object.getPrototypeOf(cl.prototype).constructor;
  // iterate trough all parents
  while (parentCtor?.name !== 'Object') {
    // extend schema
    sch = _buildSchema(parentCtor, sch!, mergedOptions, false);
    // set next parent
    parentCtor = Object.getPrototypeOf(parentCtor.prototype).constructor;
  }
  // get schema of current model
  sch = _buildSchema(cl, sch!, mergedOptions);

  return sch;
}
