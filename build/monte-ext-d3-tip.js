(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.monteExtD3Tip = global.monteExtD3Tip || {})));
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

var _monte$tools = monte.tools;
var isFunc = _monte$tools.isFunc;
var isNumeric = _monte$tools.isNumeric;
var isObject = _monte$tools.isObject;
var isArray = _monte$tools.isArray;


var TIP_DEFAULTS = {
  eventPrefix: 'd3tip',
  css: 'd3-tip',
  direction: 'n',
  offset: {},
  html: function html(d, i) {
    return d.value || d || i;
  },
  featurePrefix: '',
  featureShowBindings: ['mouseover', 'touchstart'],
  featureHideBindings: ['mouseout'],
  showBindings: [],
  hideBindings: []
};

var D3Tip = function (_monte$Extension) {
  inherits(D3Tip, _monte$Extension);

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
        throw monte.MonteOptionError.RequiredOption('featurePrefix', 'If you wish to listen directly to chart events use: "chart"');
      }
    }
  }, {
    key: '_render',
    value: function _render() {
      var css = this.tryInvoke(this.option('css'));
      var dir = this.tryInvoke(this.option('direction'));
      var html = this.option('html'); // Should always be a function.
      var offset = this.tryInvoke(this.option('offset'));
      var tip = d3.tip().attr('class', css).direction(dir).html(html);

      if (!isFunc(html)) {
        throw new monte.MonteOptionError('Check the "html" option value. A function is expected. Received: ' + html);
      }

      if (isObject(offset)) {
        tip.offset([+offset.y || +offset.top || 0, +offset.x || +offset.left || 0]);
      } else if (isNumeric(offset)) {
        // If a single number is provided assume that only a vertical shift is intended.
        tip.offset([+offset, 0]);
      } else {
        throw new monte.MonteOptionError('Check the "offset" option value. A function, object, or number is expected. Received: ' + offset);
      }

      // Create D3 Tip instance and associate with chart.
      this.chart.bound.call(tip);

      this.tip = tip;
      this._bindTipEvents();
    }
  }, {
    key: '_bindTipEvents',
    value: function _bindTipEvents() {
      var _this2 = this;

      var tip = this.tip;
      var featureShowBindings = this.tryInvoke(this.option('featureShowBindings'));
      var featureHideBindings = this.tryInvoke(this.option('featureHideBindings'));
      var showBindings = this.tryInvoke(this.option('showBindings'));
      var hideBindings = this.tryInvoke(this.option('hideBindings'));

      var featurePrefix = this.tryInvoke(this.option('featurePrefix'));
      if (!isArray(featurePrefix)) {
        featurePrefix = [featurePrefix];
      }

      featurePrefix.forEach(function (fp) {
        featureShowBindings.forEach(function (ev) {
          return _this2.chart.on(eventName(fp, ev), tip.show);
        });
        featureHideBindings.forEach(function (ev) {
          return _this2.chart.on(eventName(fp, ev), tip.hide);
        });
      });

      showBindings.forEach(function (ev) {
        return _this2.chart.on(ev, tip.show);
      });
      hideBindings.forEach(function (ev) {
        return _this2.chart.on(ev, tip.hide);
      });
    }

    // Implemented to indicate that this extension intentionally does not respond to `updated` events.
    // D3 Tip handles it's own show and hide events and renders itself.

  }, {
    key: '_update',
    value: function _update() {}
  }, {
    key: '_destroy',
    value: function _destroy() {
      this.tip.destroy();
    }
  }, {
    key: 'showTip',
    value: function showTip(data, target) {
      this.tip.show(data, target);
    }
  }, {
    key: 'hideTip',
    value: function hideTip() {
      this.tip.hide();
    }
  }]);
  return D3Tip;
}(monte.Extension);

function eventName(featurePrefix, ev) {
  return monte.Extension.featureEventName(featurePrefix, ev);
}

exports.ExtD3Tip = D3Tip;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=monte-ext-d3-tip.js.map
