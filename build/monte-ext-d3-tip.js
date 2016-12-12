(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.MonteExtD3Tip = global.MonteExtD3Tip || {})));
}(this, (function (exports) { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var isFunc = Monte.tools.isFunc;
var isNumeric = Monte.tools.isNumeric;
var isObject = Monte.tools.isObject;

var TIP_DEFAULTS = {
  eventPrefix: 'd3tip',
  css: 'd3-tip',
  direction: 'n',
  offset: {},
  html: function html(d, i) {
    return d.value || d || i;
  },
  featurePrefix: null,
  showEvents: ['mouseover', 'touchstart'],
  hideEvents: ['mouseout']
};

var D3Tip = function (_Monte$Extension) {
  inherits(D3Tip, _Monte$Extension);

  function D3Tip() {
    classCallCheck(this, D3Tip);
    return possibleConstructorReturn(this, (D3Tip.__proto__ || Object.getPrototypeOf(D3Tip)).apply(this, arguments));
  }

  createClass(D3Tip, [{
    key: '_initOptions',
    value: function _initOptions() {
      var _babelHelpers$get;

      for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
        options[_key] = arguments[_key];
      }

      (_babelHelpers$get = get(D3Tip.prototype.__proto__ || Object.getPrototypeOf(D3Tip.prototype), '_initOptions', this)).call.apply(_babelHelpers$get, [this].concat(options, [TIP_DEFAULTS]));

      // Throw option error if `featurePrefix` is left blank
      if (!this.opts.featurePrefix) {
        throw Monte.MonteOptionError.RequiredOption('featurePrefix');
      }
    }
  }, {
    key: '_render',
    value: function _render() {
      var _this2 = this;

      var featurePrefix = this.tryInvoke(this.option('featurePrefix'));
      var css = this.tryInvoke(this.option('css'));
      var dir = this.tryInvoke(this.option('direction'));
      var html = this.option('html'); // Should always be a function.
      var offset = this.tryInvoke(this.option('offset'));
      var showEvents = this.tryInvoke(this.option('showEvents'));
      var hideEvents = this.tryInvoke(this.option('hideEvents'));
      var tip = d3.tip().attr('class', css).direction(dir).html(html);

      if (!isFunc(html)) {
        throw new Monte.MonteOptionError('Check the "html" option value. A function is expected. Received: ' + html);
      }

      if (isObject(offset)) {
        tip.offset([+offset.y || +offset.top || 0, +offset.x || +offset.left || 0]);
      } else if (isNumeric(offset)) {
        // If a single number is provided assume that only a vertical shift is intended.
        tip.offset([+offset, 0]);
      } else {
        throw new Monte.MonteOptionError('Check the "offset" option value. A function, object, or number is expected. Received: ' + offset);
      }

      this.chart.bound.call(tip);

      showEvents.forEach(function (ev) {
        return _this2.chart.on(featurePrefix + ':' + ev, tip.show);
      });
      hideEvents.forEach(function (ev) {
        return _this2.chart.on(featurePrefix + ':' + ev, tip.hide);
      });

      this.tip = tip;
    }

    // Implemented to indicate that this extension intentionally does not respond to `updated` events.

  }, {
    key: '_update',
    value: function _update() {}
  }, {
    key: '_destroy',
    value: function _destroy() {
      this.tip.destroy();
    }
  }]);
  return D3Tip;
}(Monte.Extension);

exports.ExtD3Tip = D3Tip;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=monte-ext-d3-tip.js.map
