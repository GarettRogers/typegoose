import { assertion } from './internal/utils';
import { constructors, models } from './internal/data';
import { logger } from './logSettings';

/**
 * Deletes an existing model so that it can be overwritten
 * with another model
 * (deletes from mongoose.connection & typegoose models cache & typegoose constructors cache)
 * @param key
 * @example
 * ```ts
 * class Name {}
 * const NameModel = getModelForClass(Name);
 * deleteModel("Name");
 * ```
 */
export function deleteModel(name: string) {
  assertion(typeof name === 'string', new TypeError('name is not an string! (deleteModel)'));
  assertion(models.has(name), new Error(`Model "${name}" could not be found`));

  logger.debug('Deleting Model "%s"', name);

  models.get(name)!.db.deleteModel(name);

  models.delete(name);
  constructors.delete(name);
}
