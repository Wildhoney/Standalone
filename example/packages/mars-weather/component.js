import React, { Component, PropTypes, createClass } from 'react';
import { get } from 'axios';
import { camelizeKeys } from 'humps';
import moment from 'moment';

/**
 * @method propTypes
 * @type {Object}
 */
const propTypes = {
    unit: PropTypes.string.isRequired
};

/**
 * @method getInitialState
 * @return {Object}
 */
const getInitialState = function getInitialState() {
    return { weather: {} };
};

/**
 * @method getDefaultProps
 * @return {Object}
 */
const getDefaultProps = function getDefaultProps() {
    return { unit: 'F' };
};

/**
 * @method componentWillMount
 * @return {void}
 */
const componentWillMount = function componentWillMount() {

    get('/weather').then(response => {
        this.setState({ weather: camelizeKeys(response.data).report });
    });

};

/**
 * @method render
 * @return {XML}
 */
const render = function render() {

    const { weather } = this.state;
    const unitProps = this.props.unit === 'F' ? ['minTempFahrenheit', 'maxTempFahrenheit'] : ['minTemp', 'maxTemp'];
    const temperature = (weather[unitProps[0]] + weather[unitProps[1]]) / 2;

    return (
        <section>
            <var>{temperature ? Number(temperature).toFixed(1) : String.fromCharCode(8212)}&deg;{this.props.unit}</var>
            <label>is the current weather on Mars</label>

            {weather.atmoOpacity && (

                <ul className="other">
                    <li>Weather: {weather.atmoOpacity}</li>
                    <li>Sunrise: {moment(weather.sunrise).format('LT')}</li>
                    <li>Sunset: {moment(weather.sunset).format('LT')}</li>
                </ul>

            )}
        </section>
    );

};

export default createClass({ propTypes, getInitialState, getDefaultProps, componentWillMount, render });
