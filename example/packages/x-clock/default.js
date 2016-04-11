import { make } from '../../../src/standalone';
import component from './js/clock';

const schema = {
    date: {
        type: Date,
        default: Date.now()
    },
    format: {
        type: String,
        default: 'H:i:s'
    },
    timezone: {
        type: String,
        default: 'GST'
    }
};

export default make({ tag: 'x-clock', schema, component });
