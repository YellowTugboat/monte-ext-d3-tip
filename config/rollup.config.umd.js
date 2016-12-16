import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  format: 'umd',
  entry: 'index.js',
  dest: 'build/monte-ext-d3-tip.js',
  moduleName: 'monteExtD3Tip',
  plugins: [
    nodeResolve({ jsnext: true, main: true }),
    babel(),
  ],
  globals: {
    d3: 'd3',
    monte: 'monte',
  },
  sourceMap: true,
};
