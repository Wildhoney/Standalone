![React Standalone](media/logo.png)

> Create framework agnostic components with all the benefits of the React ecosystem &ndash; using the HTML5 [custom elements API](https://www.w3.org/TR/custom-elements/) to extend HTML's vocabulary.

![Travis](http://img.shields.io/travis/Wildhoney/Standalone.svg?style=flat-square)
&nbsp;
![npm](http://img.shields.io/npm/v/react-standalone.svg?style=flat-square)
&nbsp;
![License MIT](http://img.shields.io/badge/License-MIT-lightgrey.svg?style=flat-square)

* **npm:** `npm install react-standalone --save`

---

# Getting Started

Take a look at the [`mars-weather` component](example/packages/mars-weather) for an idea on how to structure your component &ndash; however essentially a *component* consists of a `tagName` &mdash; such as `mars-weather`, the React `component` and an [optional schema](#specifying-a-schema) using [`osom`](https://github.com/Kikobeats/osom).

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
