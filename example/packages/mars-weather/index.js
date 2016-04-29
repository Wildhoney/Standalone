import { createModule } from '../../../src/standalone';
import schema from './schema';
import component from './component';
import methods from './methods';

export default createModule('mars-weather', { schema, methods, component });
