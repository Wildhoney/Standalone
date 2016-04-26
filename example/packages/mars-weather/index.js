import { make } from '../../../src/standalone';
import schema from './schema';
import component from './component';
import methods from './methods';

export default make('mars-weather', { schema, methods, component });
