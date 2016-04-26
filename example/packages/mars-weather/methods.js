/**
 * @method getWeather
 * @return {String}
 */
const getWeather = function() {

    if (this.component) {
        return `The current weather on Mars is ${this.component.state.weather.atmoOpacity.toLowerCase()}!`;
    }

    throw new Error('Standalone: Component has not yet been rendered to the DOM.');

};

export default { getWeather };
