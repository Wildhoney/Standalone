![React Standalone](media/logo.png)

> Create framework agnostic components that are truly reusable and interoperable with all the benefits of the React ecosystem &ndash; using the HTML5 [custom elements API](https://www.w3.org/TR/custom-elements/) to extend HTML's vocabulary.

![Travis](http://img.shields.io/travis/Wildhoney/Standalone.svg?style=flat-square)
&nbsp;
![npm](http://img.shields.io/npm/v/react-standalone.svg?style=flat-square)
&nbsp;
![License MIT](http://img.shields.io/badge/license-mit-lightgrey.svg?style=flat-square)

* **npm:** `npm install react-standalone --save`

## Table of Contents

* [Getting Started](#getting-started)
* [Handling Props](#handling-props)
    * [Specifying a Schema](#specifying-a-schema)
* [Component Events](#component-events)
    * [Passing JSON Structure](#passing-json-structure)
* [Browser Support](#browser-support)
    
---

## Getting Started

Take a look at the [`mars-weather` component](example/packages/mars-weather) for an idea on how to structure your reusable component &ndash; however essentially a *component* consists of a tag name &mdash; such as `mars-weather`, the React `component` and an [optional schema](#specifying-a-schema) using [`osom`](https://github.com/Kikobeats/osom).

```javascript
import { make } from 'standalone';
import schema from './schema';
import component from './component';

export default make('mars-weather', { schema, component });

```

Once you have created your package, a custom element will be created with the supplied `tagName` which can be embedded into the DOM &ndash; all of the React lifecycle methods will be invoked, such as `componentWillUnmount` when the element has been removed from the DOM.

```html
<mars-weather />
```

As the `mars-weather` component is an entirely custom element, it can be embedded in **any** JavaScript framework &mdash; Angular, Vue, React, Cycle, Ember, [Vanilla](http://vanilla-js.com/), etc...

**Bonus:** Use [Keo with shadow boundaries](https://github.com/Wildhoney/Keo/blob/master/docs/SHADOW_DOM.md) for a true [Polymer-esque](https://www.polymer-project.org/1.0/) feel.

## Handling Props

By specifying attributes on the custom element, the values of the attributes are passed into your component as props &ndash; any changes to the `state` will be handled internally to your component, whereas any changes to your element's attributes will cause a re-render with the updated `props`.

In the `mars-weather` example, we have setup the `getDefaultProps` method to return the default props, however users can override the `unit` prop by passing in a [`data` attribute](http://html5doctor.com/html5-custom-data-attributes/) named `data-unit`.

```html
<mars-weather data-unit="C" />
```

In the above case, the `data-unit` attribute will be transformed to `unit` &mdash; as `Standalone` strips away any `data-` prefixes &mdash; and then re-renders your component, allowing you to access the attribute as `this.props.unit`.

### Specifying a Schema

As **all** HTML attributes are `string`s, `Standalone` allows you to specify a schema for your component, which will transform `string` attributes into the data type you expect using [`osom`](https://github.com/Kikobeats/osom).

```javascript
export default {
    unit: {
        type: String,
        default: 'F'
    }
};
```

Once you have configured the schema to use for your component, you can happily setup the usual [React `propTypes`](https://facebook.github.io/react/docs/reusable-components.html) specifying the data type you're expecting to be passed through.

## Component Events

Using [Custom Events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) you can easily set-up a communication channel between your components and the outside world.

```javascript
// Instantiate `CustomEvent` and then specify the name of the event, followed
// by the payload which will be passed to your listener function.
const event = new CustomEvent('migrate-planets', {
    bubbles: true,
    detail: {
        planet: 'Saturn'
    }
});

findDOMNode(this).dispatchEvent(event);
```

It's crucial that you emit the event as `bubbles: true` otherwise the event would simply halt at the `findDOMNode(this)` node rather than bubbling up to the `mars-weather` node &mdash; unless you dispatch the event on the `mars-weather` node by using `findDOMNode(this).parentNode`.

Within your component you emit the event &mdash; `CustomEvent` &mdash; using `dispatchEvent` and then bind your custom element &mdash; such as `mars-weather` &mdash; using `addEventListener` from the outside.

```javascript
const node = document.querySelector('mars-weather');

node.addEventListener('migrate-planets', event => {

    // Update the `data-planet` attribute to reflect the newly migrated planet
    // which will cause the component to re-render with the update prop.
    node.setAttribute('data-planet', event.detail.planet);

});
```

### Passing JSON Structure

As invoking `setAttribute` on your component causes React to re-render your component, it may be useful to supply a JSON payload to your component instead &mdash; especially if you're defining a multitude of attributes; this also helps with performance as you would only need one `setAttribute` to update many props and re-render.

By defining a schema you can specify an attribute that will be parsed as JSON.

```javascript
export default {
    payload: {
        type: JSON.parse
    }
}
```

Attaching a JSON string to your element's `data-payload` attribute will cause it to be parsed into an object using `JSON.parse`, and passed to your React component as `this.props.payload` which can be defined in the `propTypes` using `PropTypes.shape`.

## Browser Support

* Chrome >= v33
* Opera >= v20
* *IE >= 11
* *Safari >= 7
* *Firefox

_\* Requires the excellent [webcomponents-lite.js](https://github.com/WebComponents/webcomponentsjs) polyfill (13K gzipped)_

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)
