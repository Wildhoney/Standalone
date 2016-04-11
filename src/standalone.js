import React, { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import WeakMap from 'es6-weak-map';
import { memoize } from 'ramda';
import osom from 'osom';

/**
 * @constant components
 * @type {Object}
 */
const components = {};

/**
 * @constant metaData
 * @type {WeakMap}
 */
const metaData = new WeakMap();

/**
 * @constant prototype
 * @type {Object}
 */
const prototype = Object.create(window.HTMLElement.prototype);

/**
 * @method removePrefix
 * @param {String} attr
 * @return {String}
 */
const removePrefix = memoize(attr => attr.replace('data-', ''));

/**
 * @method tagName
 * @param {String} nodeName
 * @return {String}
 */
const tagName = memoize(nodeName => nodeName.toLowerCase());

/**
 * @method metaDataFor
 * @param {HTMLElement} element
 * @return {Object}
 */
const metaDataFor = element => metaData.get(element);

/**
 * @method renderComponent
 * @param {Function} Component
 * @param {HTMLElement} element
 * @param {Object} [schema]
 * @return {void}
 */
const renderComponent = (Component, element, schema) => {

    const validator = schema ? osom(schema) : x => x;

    const attributes = validator(Object.keys(element.attributes).reduce((accumulator, key) => {

        // Reduce the NodeList into a standard object for passing into the React component.
        const attribute = element.attributes[key];
        return { ...accumulator, [removePrefix(attribute.nodeName)]: attribute.nodeValue };

    }, {}));

    console.log(attributes);

    render(<Component {...attributes} />, element);

};

/**
 * @method createdCallback
 * @return {void}
 */
prototype.createdCallback = function createdCallback() {

    metaData.set(this, {
        isMounted: false
    });
    
};

/**
 * @method attributeChangedCallback
 * @param {String} attr
 * @param {String} _
 * @param {String} value
 * @return {void}
 */
prototype.attributeChangedCallback = function attributeChangedCallback(attr, _, value) {

    const meta = metaDataFor(this);

    if (meta.isMounted) {

        // Re-render element only if it's currently mounted.
        const tag = tagName(this.nodeName);
        const { component, schema } = components[tag];
        renderComponent(component, this, schema);

    }

};

/**
 * @method attachedCallback
 * @return {void}
 */
prototype.attachedCallback = function attachedCallback() {

    const tag = tagName(this.nodeName);
    const meta = metaDataFor(this);

    // Element has been attached to the DOM, so we'll update the meta data, and
    // then render the element into the custom element container.
    metaData.set(this, { ...meta, isMounted: true });
    const { component, schema } = components[tag];
    renderComponent(component, this, schema);

};

/**
 * @method detachedCallback
 * @return {void}
 */
prototype.detachedCallback = function detachedCallback() {

    metaData.set(this, {
        isMounted: false
    });

    // Instruct the component to unmount, which will invoke the `componentWillUnmount` lifecycle
    // function for handling any cleaning up of the component.
    unmountComponentAtNode(this);

};

/**
 * @method make
 * @param {String} tag
 * @param {Object} schema
 * @param {Object} component
 * @return {Object}
 */
export const make = (tag, { schema, component }) => {

    document.registerElement(tagName(tag), { prototype });
    components[tagName(tag)] = { component, schema };
    return component;

};
