/* imports */
import 'reflect-metadata';

import { parseENV, setGlobalOptions } from './globalOptions';
import type {
  DocumentType,
  Ref,
  ReturnModelType
} from './types';

/* exports */
// export the internally used "mongoose", to not need to always import it
export { setGlobalOptions };
export { setLogLevel, LogLevels } from './logSettings';
export * from './prop';
export * from './hooks';
export * from './plugin';
export * from './index';
export * from './modelOptions';
export { DocumentType, Ref, ReturnModelType };
export { Severity } from './internal/constants';

parseENV(); // call this before anything to ensure they are applied


