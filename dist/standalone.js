module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.createModule = exports.make = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _ramda = __webpack_require__(3);

	var _osom = __webpack_require__(4);

	var _osom2 = _interopRequireDefault(_osom);

	var _humps = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	/**
	 * @constant metaData
	 * @type {Symbol}
	 */
	var metaData = Symbol('standalone/meta-data');

	/**
	 * @method removePrefix
	 * @param {String} attr
	 * @return {String}
	 */
	var removePrefix = (0, _ramda.memoize)(function (attr) {
	    return attr.replace('data-', '');
	});

	/**
	 * @method throwError
	 * @param {String} message
	 * @return {void}
	 */
	var throwError = function throwError(message) {
	    throw 'Standalone: ' + message + '.';
	};

	/**
	 * @method renderComponent
	 * @param {Function} Component
	 * @param {HTMLElement} element
	 * @param {Object} [schema]
	 * @return {Object}
	 */
	var renderComponent = function renderComponent(Component, element, schema) {

	    var validator = schema ? (0, _osom2.default)(schema) : function (x) {
	        return x;
	    };
	    var parseNodeName = (0, _ramda.compose)(_humps.camelize, removePrefix);
	    var keys = Object.keys(element.attributes);

	    /**
	     * @method dataAttributes
	     * @param {Object} attributes
	     * @param {String} key
	     * @return {Boolean}
	     */
	    var dataAttributes = (0, _ramda.curry)(function (attributes, key) {
	        return (/data-/.test(attributes[key].nodeName)
	        );
	    });

	    var attributes = validator(keys.filter(dataAttributes(element.attributes)).reduce(function (accumulator, key) {

	        // Reduce the NodeList into a standard object for passing into the React component.
	        var attribute = element.attributes[key];
	        return _extends({}, accumulator, _defineProperty({}, parseNodeName(attribute.nodeName), attribute.nodeValue));
	    }, {}));

	    return (0, _reactDom.render)(_react2.default.createElement(Component, attributes), element);
	};

	/**
	 * @method getPrototype
	 * @param {String} inherits
	 * @param {Object} schema
	 * @param {Object} methods
	 * @param {Object} component
	 * @return {Object}
	 */
	var getPrototype = function getPrototype(_ref) {
	    var inherits = _ref.inherits;
	    var schema = _ref.schema;
	    var methods = _ref.methods;
	    var component = _ref.component;


	    var prototypeFrom = Object.getPrototypeOf(document.createElement(inherits));
	    var isUnknownElement = prototypeFrom === window.HTMLUnknownElement.prototype;
	    var prototype = Object.create(isUnknownElement ? window.HTMLElement.prototype : prototypeFrom);

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
	            var _metaData = this[metaData];
	            var _component = _metaData.component;
	            var _schema = _metaData.schema;

	            this.component = renderComponent(_component, this, _schema);
	        }
	    };

	    /**
	     * @method attachedCallback
	     * @return {void}
	     */
	    prototype.attachedCallback = function attachedCallback() {

	        // Element has been attached to the DOM, so we'll update the meta data, and
	        // then render the element into the custom element container.
	        var _metaData2 = this[metaData];
	        var component = _metaData2.component;
	        var schema = _metaData2.schema;

	        this.component = renderComponent(component, this, schema);
	    };

	    /**
	     * @method detachedCallback
	     * @return {void}
	     */
	    prototype.detachedCallback = function detachedCallback() {

	        // Instruct the component to unmount, which will invoke the `componentWillUnmount` lifecycle
	        // function for handling any cleaning up of the component.
	        (0, _reactDom.unmountComponentAtNode)(this);
	        this.component = null;
	    };

	    (typeof methods === 'undefined' ? 'undefined' : _typeof(methods)) === 'object' && Object.keys(methods).forEach(function (key) {

	        // Apply the user-defined functions onto the prototype.
	        prototype[key] = prototype[key] || methods[key];
	    });

	    // Register the metadata used by Standalone.
	    prototype[metaData] = { methods: methods, schema: schema, component: component };

	    return prototype;
	};

	/**
	 * @method createModule
	 * @param {String} reference
	 * @param {Object} schema
	 * @param {Object} methods
	 * @param {Object} component
	 * @return {Object|void}
	 */
	var make = exports.make = function make(reference, _ref2) {
	    var schema = _ref2.schema;
	    var methods = _ref2.methods;
	    var component = _ref2.component;

	    console.warn('Standalone: `make` function has been deprecated in favour of more explicit `createModule`.');
	    return createModule(reference, { schema: schema, methods: methods, component: component });
	};

	/**
	 * @method createModule
	 * @param {String} reference
	 * @param {Object} schema
	 * @param {Object} methods
	 * @param {Object} component
	 * @return {Object|void}
	 */
	var createModule = exports.createModule = function createModule(reference, _ref3) {
	    var schema = _ref3.schema;
	    var methods = _ref3.methods;
	    var component = _ref3.component;

	    var _ref4 = function () {
	        var regExp = /^(.+?)(?:\/(.+?))?$/i;
	        var matches = reference.match(regExp);
	        return [matches[2] || matches[1], matches[2] ? matches[1] : undefined];
	    }();

	    var _ref5 = _slicedToArray(_ref4, 2);

	    var name = _ref5[0];
	    var inherits = _ref5[1];


	    try {

	        return document.registerElement(name, (0, _ramda.pickBy)((0, _ramda.complement)(_ramda.isNil), {
	            prototype: getPrototype({ inherits: inherits, schema: schema, methods: methods, component: component }),
	            extends: inherits
	        }));
	    } catch (e) {
	        return void throwError(e.message);
	    }
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("react-dom");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("ramda");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("osom");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	// =========
	// = humps =
	// =========
	// Underscore-to-camelCase converter (and vice versa)
	// for strings and object keys

	// humps is copyright © 2012+ Dom Christie
	// Released under the MIT license.

	;(function (global) {

	  var _processKeys = function _processKeys(convert, obj, options) {
	    if (!_isObject(obj) || _isDate(obj) || _isRegExp(obj) || _isBoolean(obj)) {
	      return obj;
	    }

	    var output,
	        i = 0,
	        l = 0;

	    if (_isArray(obj)) {
	      output = [];
	      for (l = obj.length; i < l; i++) {
	        output.push(_processKeys(convert, obj[i], options));
	      }
	    } else {
	      output = {};
	      for (var key in obj) {
	        if (obj.hasOwnProperty(key)) {
	          output[convert(key, options)] = _processKeys(convert, obj[key], options);
	        }
	      }
	    }
	    return output;
	  };

	  // String conversion methods

	  var separateWords = function separateWords(string, options) {
	    options = options || {};
	    var separator = options.separator || '_';
	    var split = options.split || /(?=[A-Z])/;

	    return string.split(split).join(separator);
	  };

	  var camelize = function camelize(string) {
	    if (_isNumerical(string)) {
	      return string;
	    }
	    string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
	      return chr ? chr.toUpperCase() : '';
	    });
	    // Ensure 1st char is always lowercase
	    return string.substr(0, 1).toLowerCase() + string.substr(1);
	  };

	  var pascalize = function pascalize(string) {
	    var camelized = camelize(string);
	    // Ensure 1st char is always uppercase
	    return camelized.substr(0, 1).toUpperCase() + camelized.substr(1);
	  };

	  var decamelize = function decamelize(string, options) {
	    return separateWords(string, options).toLowerCase();
	  };

	  // Utilities
	  // Taken from Underscore.js

	  var toString = Object.prototype.toString;

	  var _isObject = function _isObject(obj) {
	    return obj === Object(obj);
	  };
	  var _isArray = function _isArray(obj) {
	    return toString.call(obj) == '[object Array]';
	  };
	  var _isDate = function _isDate(obj) {
	    return toString.call(obj) == '[object Date]';
	  };
	  var _isRegExp = function _isRegExp(obj) {
	    return toString.call(obj) == '[object RegExp]';
	  };
	  var _isBoolean = function _isBoolean(obj) {
	    return toString.call(obj) == '[object Boolean]';
	  };

	  // Performant way to determine if obj coerces to a number
	  var _isNumerical = function _isNumerical(obj) {
	    obj = obj - 0;
	    return obj === obj;
	  };

	  // Sets up function which handles processing keys
	  // allowing the convert function to be modified by a callback
	  var _processor = function _processor(convert, options) {
	    var callback = options && 'process' in options ? options.process : options;

	    if (typeof callback !== 'function') {
	      return convert;
	    }

	    return function (string, options) {
	      return callback(string, convert, options);
	    };
	  };

	  var humps = {
	    camelize: camelize,
	    decamelize: decamelize,
	    pascalize: pascalize,
	    depascalize: decamelize,
	    camelizeKeys: function camelizeKeys(object, options) {
	      return _processKeys(_processor(camelize, options), object);
	    },
	    decamelizeKeys: function decamelizeKeys(object, options) {
	      return _processKeys(_processor(decamelize, options), object, options);
	    },
	    pascalizeKeys: function pascalizeKeys(object, options) {
	      return _processKeys(_processor(pascalize, options), object);
	    },
	    depascalizeKeys: function depascalizeKeys() {
	      return this.decamelizeKeys.apply(this, arguments);
	    }
	  };

	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (humps), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof module !== 'undefined' && module.exports) {
	    module.exports = humps;
	  } else {
	    global.humps = humps;
	  }
	})(undefined);

/***/ }
/******/ ]);