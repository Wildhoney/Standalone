import React, { Component, propTypes, createClass } from 'react';
import { get } from 'axios';
import { camelizeKeys } from 'humps';
import moment from 'moment';

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
            <label>The weather on Mars is currently:</label>
            <var>{temperature || String.fromCharCode(8212)}&deg;{this.props.unit}</var>

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

export default createClass({ getInitialState, getDefaultProps, componentWillMount, render });
