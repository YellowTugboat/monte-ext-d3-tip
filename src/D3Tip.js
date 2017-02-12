const { isFunc, isNumeric, isObject, isArray } = monte.tools;

const TIP_DEFAULTS = {
  eventPrefix: 'd3tip',
  css: 'd3-tip',
  direction: 'n',
  offset: {},
  html: (d, i) => d.value || d || i,
  featurePrefix: '',
  featureShowBindings: ['mouseover', 'touchstart'],
  featureHideBindings: ['mouseout'],
  showBindings: [],
  hideBindings: [],
};

export class D3Tip extends monte.Extension {
  _initOptions(...options) {
    super._initOptions(...options, TIP_DEFAULTS);

    // Throw option error if `featurePrefix` is left blank
    if (!this.opts.featurePrefix) {
      throw monte.MonteOptionError.RequiredOption('featurePrefix', 'If you wish to listen directly to chart events use: "chart"');
    }
  }

  _render() {
    const css = this.tryInvoke(this.option('css'));
    const dir = this.tryInvoke(this.option('direction'));
    const html = this.option('html'); // Should always be a function.
    const offset = this.tryInvoke(this.option('offset'));
    const tip = d3.tip().attr('class', css)
      .direction(dir)
      .html(html);

    if (!isFunc(html)) {
      throw new monte.MonteOptionError(`Check the "html" option value. A function is expected. Received: ${html}`);
    }

    if (isObject(offset)) {
      tip.offset([
        +offset.y || +offset.top || 0,
        +offset.x || +offset.left || 0,
      ]);
    }
    else if (isNumeric(offset)) {
      // If a single number is provided assume that only a vertical shift is intended.
      tip.offset([+offset, 0]);
    }
    else {
      throw new monte.MonteOptionError(`Check the "offset" option value. A function, object, or number is expected. Received: ${offset}`);
    }

    // Create D3 Tip instance and associate with chart.
    this.chart.bound.call(tip);

    this.tip = tip;
    this._bindTipEvents();
  }

  _bindTipEvents() {
    const tip = this.tip;
    const featureShowBindings = this.tryInvoke(this.option('featureShowBindings'));
    const featureHideBindings = this.tryInvoke(this.option('featureHideBindings'));
    const showBindings = this.tryInvoke(this.option('showBindings'));
    const hideBindings = this.tryInvoke(this.option('hideBindings'));

    let featurePrefix = this.tryInvoke(this.option('featurePrefix'));
    if (!isArray(featurePrefix)) { featurePrefix = [featurePrefix]; }

    featurePrefix.forEach((fp) => {
      featureShowBindings.forEach((ev) => this.chart.on(eventName(fp, ev), tip.show));
      featureHideBindings.forEach((ev) => this.chart.on(eventName(fp, ev), tip.hide));
    });

    showBindings.forEach((ev) => this.chart.on(ev, tip.show));
    hideBindings.forEach((ev) => this.chart.on(ev, tip.hide));
  }

  // Implemented to indicate that this extension intentionally does not respond to `updated` events.
  // D3 Tip handles it's own show and hide events and renders itself.
  _update() {}

  _destroy() {
    this.tip.destroy();
  }

  showTip(data, target) {
    this.tip.show(data, target);
  }

  hideTip() {
    this.tip.hide();
  }
}

function eventName(featurePrefix, ev) {
  return monte.Extension.featureEventName(featurePrefix, ev);
}
