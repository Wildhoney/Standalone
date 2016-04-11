/**
 * Use the schema to define the types of the properties passed to your React entry point.
 * By using schemas you can happily define the `propTypes` for your component based on
 * what you expect, as otherwise all HTML attributes would be passed as string, which is
 * the default if no schema has been defined for your component.
 *
 * @constant schema
 * @type {Object}
 */
export default {

    /**
     * Determines whether or not we're displaying fahrenheit or celsius in our Mars weather
     * component. HTML attributes can be updated which will cause your component to re-render
     * with its new props.
     *
     * @constant unit
     * @type {Object}
     */
    unit: {
        type: String,
        default: 'fahrenheit'
    }
    
};
