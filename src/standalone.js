import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import WeakMap from 'es6-weak-map';
import { memoize } from 'ramda';

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
 * @method createdCallback
 * @return {void}
 */
prototype.createdCallback = function createdCallback() {
    
    metaData.set(this, {
        attributes: {},
        isMounted: false
    });
    
};

/**
 * @method attributeChangedCallback
 * @param {String} attr
 * @param {String} oldValue
 * @param {String} value
 * @return {void}
 */
prototype.attributeChangedCallback = function attributeChangedCallback(attr, oldValue, value) {
    
    const meta = metaData.get(this);
    
    metaData.set(this, {
        isMounted: meta.isMounted,
        attributes: {
            ...meta.attributes,
            [removePrefix(attr)]: value
        }
    });

    // Re-render element only if it's currently mounted.
    const tag = tagName(this.nodeName);
    meta.isMounted && render(components[tag], this);
    
};

/**
 * @method attachedCallback
 * @return {void}
 */
prototype.attachedCallback = function attachedCallback() {

    const tag = tagName(this.nodeName);
    const element = components[tag];
    const meta = metaData.get(this);

    metaData.set(this, {
        isMounted: true,
        attributes: meta.attributes
    });

    render(element, this);

};

/**
 * @method detachedCallback
 * @return {void}
 */
prototype.detachedCallback = function detachedCallback() {

    const meta = metaData.get(this);

    metaData.set(this, {
        isMounted: false,
        attributes: meta.attributes
    });

    unmountComponentAtNode(this);

};

/**
 * @method make
 * @param {String} tag
 * @param {Object} schema
 * @param {Object} component
 * @return {Object}
 */
export const make = ({ tag, schema, component }) => {

    document.registerElement(tagName(tag), { prototype });
    components[tagName(tag)] = createElement(component);
    return component;

};
