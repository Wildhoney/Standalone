import React, { Component } from 'react';
import { get as fetch } from 'axios';
import moment from 'moment';

export default class extends Component {

    /**
     * @constructor
     */
    constructor() {
        super();
        this.state = { date: Date.now(), timezone: '' };
    }

    /**
     * @method componentDidMount
     * @return {void}
     */
    componentDidMount() {

    }

    /**
     * @method render
     * @return {XML}
     */
    render() {
        return (
            <section>
                <datetime>{moment(this.state.date).format(this.state.format)}</datetime>
                <label>TZ {this.state.timezone}</label>
            </section>
        );
    }
}
