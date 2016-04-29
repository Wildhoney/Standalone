import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { memoize, compose, curry, pickBy, complement, isNil } from 'ramda';
import osom from 'osom';
import { camelize } from 'humps';

/**
 * @constant metaData
 * @type {Symbol}
 */
const metaData = Symbol('standalone/meta-data');

/**
 * @method removePrefix
 * @param {String} attr
 * @return {String}
 */
const removePrefix = memoize(attr => attr.replace('data-', ''));

/**
 * @method throwError
 * @param {String} message
 * @return {void}
 */
const throwError = message => {
    throw `Standalone: ${message}.`;
};

/**
 * @method renderComponent
 * @param {Function} Component
 * @param {HTMLElement} element
 * @param {Object} [schema]
 * @return {Object}
 */
const renderComponent = (Component, element, schema) => {

    const validator = schema ? osom(schema) : x => x;
    const parseNodeName = compose(camelize, removePrefix);
    const keys = Object.keys(element.attributes);

    /**
     * @method dataAttributes
     * @param {Object} attributes
     * @param {String} key
     * @return {Boolean}
     */
    const dataAttributes = curry((attributes, key) => {
        return /data-/.test(attributes[key].nodeName);
    });

    const attributes = validator(keys.filter(dataAttributes(element.attributes)).reduce((accumulator, key) => {

        // Reduce the NodeList into a standard object for passing into the React component.
        const attribute = element.attributes[key];
        return { ...accumulator, [parseNodeName(attribute.nodeName)]: attribute.nodeValue };

    }, {}));

    return render(<Component {...attributes} />, element);

};

/**
 * @method getPrototype
 * @param {String} inherits
 * @param {Object} schema
 * @param {Object} methods
 * @param {Object} component
 * @return {Object}
 */
const getPrototype = ({ inherits, schema, methods, component }) => {

    const prototypeFrom = Object.getPrototypeOf(document.createElement(inherits));
    const isUnknownElement = prototypeFrom === HTMLUnknownElement.prototype;
    const prototype = Object.create(isUnknownElement ? HTMLElement.prototype : prototypeFrom);

    /**
     * @method createdCallback
     * @return {void}
     */
    prototype.createdCallback = function createdCallback() {
        this.component = null;
    };

    /**
     * @method attributeChangedCallback
     * @return {void}
     */
    prototype.attributeChangedCallback = function attributeChangedCallback() {

        if (this[metaData].component) {

            // Re-render element only if it's currently mounted.
            const { component, schema } = this[metaData];
            this.component = renderComponent(component, this, schema);

        }

    };

    /**
     * @method attachedCallback
     * @return {void}
     */
    prototype.attachedCallback = function attachedCallback() {

        // Element has been attached to the DOM, so we'll update the meta data, and
        // then render the element into the custom element container.
        const { component, schema } = this[metaData];
        this.component = renderComponent(component, this, schema);

    };

    /**
     * @method detachedCallback
     * @return {void}
     */
    prototype.detachedCallback = function detachedCallback() {

        // Instruct the component to unmount, which will invoke the `componentWillUnmount` lifecycle
        // function for handling any cleaning up of the component.
        unmountComponentAtNode(this);
        this.component = null;

    };

    Object.keys(methods).forEach(key => {

        // Apply the user-defined functions onto the prototype.
        prototype[key] = prototype[key] || methods[key];

    });

    // Register the metadata used by Standalone.
    prototype[metaData] = { methods, schema, component };

    return prototype;

};

/**
 * @method make
 * @param {String} reference
 * @param {Object} schema
 * @param {Object} methods
 * @param {Object} component
 * @return {Object|void}
 */
export const make = (reference, { schema, methods, component }) => {

    const [name, inherits] = (() => {
        const regExp = /^(.+?)(?:\/(.+?))?$/i;
        const matches = reference.match(regExp);
        return [matches[2] || matches[1], matches[2] ? matches[1] : undefined];
    })();

    try {

        return document.registerElement(name, pickBy(complement(isNil), {
            prototype: getPrototype({ inherits, schema, methods, component }),
            extends: inherits
        }));

    } catch (e) {
        return void throwError(e.message);
    }

};
