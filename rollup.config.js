
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: './src/index.js',
  dest: './dist/perf.min.js',
  plugins: [
    nodeResolve({}),
    commonjs({}),
    babel({
      exclude: 'node_modules/**',
      "presets": [
        [
          "es2015",
          {
            "modules": false
          }
        ]
      ],
      "plugins": [
        "external-helpers"
      ],
      //  presets: ['es2015-rollup'],
      babelrc: false
    }),
    uglify()
  ],
  format: 'umd',
  moduleName: 'Perf'
};
