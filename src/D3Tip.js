const isFunc = Monte.tools.isFunc;
const isNumeric = Monte.tools.isNumeric;
const isObject = Monte.tools.isObject;

const TIP_DEFAULTS = {
  eventPrefix: 'd3tip',
  css: 'd3-tip',
  direction: 'n',
  offset: {},
  html: (d, i) => d.value || d || i,
  featurePrefix: null,
  showEvents: ['mouseover', 'touchstart'],
  hideEvents: ['mouseout'],
};

export class D3Tip extends Monte.Extension {
  _initOptions(...options) {
    super._initOptions(...options, TIP_DEFAULTS);

    // Throw option error if `featurePrefix` is left blank
    if (!this.opts.featurePrefix) {
      throw Monte.MonteOptionError.RequiredOption('featurePrefix');
    }
  }

  _render() {
    const featurePrefix = this.tryInvoke(this.option('featurePrefix'));
    const css = this.tryInvoke(this.option('css'));
    const dir = this.tryInvoke(this.option('direction'));
    const html = this.option('html'); // Should always be a function.
    const offset = this.tryInvoke(this.option('offset'));
    const showEvents = this.tryInvoke(this.option('showEvents'));
    const hideEvents = this.tryInvoke(this.option('hideEvents'));
    const tip = d3.tip().attr('class', css)
      .direction(dir)
      .html(html);

    if (!isFunc(html)) {
      throw new Monte.MonteOptionError(`Check the "html" option value. A function is expected. Received: ${html}`);
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
      throw new Monte.MonteOptionError(`Check the "offset" option value. A function, object, or number is expected. Received: ${offset}`);
    }

    this.chart.bound.call(tip);

    showEvents.forEach((ev) => this.chart.on(`${featurePrefix}:${ev}`, tip.show));
    hideEvents.forEach((ev) => this.chart.on(`${featurePrefix}:${ev}`, tip.hide));

    this.tip = tip;
  }

  // Implemented to indicate that this extension intentionally does not respond to `updated` events.
  _update() {}

  _destroy() {
    this.tip.destroy();
  }
}
