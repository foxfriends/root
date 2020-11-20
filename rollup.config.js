import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';
import babel from '@rollup/plugin-babel';
import pegjs from 'rollup-plugin-pegjs';
import url from '@rollup/plugin-url';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'app/index.js',
  output: {
    dir: 'dist/',
    format: 'iife',
    name: 'app',
    sourcemap: true,
  },
  watch: {
    include: ['app/**'],
  },

  plugins: [
    // allows use node-style directory import (omitting /index part)
    nodeResolve({ browser: true }),

    url({
      include: ['**/*.svg', '**/*.png', '**/*.jp(e)?g', '**/*.gif', '**/*.webp', '**/*.ftl'],
    }),

    pegjs(),

    svelte({
      // Extract CSS into a single bundled file (recommended).
      css(css) {
        css.write('index.css');
      },

      // Emit CSS as "files" for other plugins to process
      // NOTE: postcss needs emitCss option to be true, but
      // for some reason, it just fails with error and my searches of
      // reason weren't successful
      emitCss: false,
      dev: !production,

      preprocess: sveltePreprocess({
        sourceMap: !production,
        babel: true,
        postcss: true,
      }),
    }),

    babel({
      babelHelpers: 'bundled',
      exclude: ['node_modules/**'],
    }),

    commonjs(),

    // reloads page during serve after every code change
    !production && livereload(),

    // copying files to dist, because rollup doesn't do it by itself
    copy({
      targets: [
        { src: 'app/image/**/*', dest: 'dist/image' },
        { src: ['app/**/*.woff', 'app/**/*.woff2'], dest: 'dist' },
        { src: 'app/index.html', dest: 'dist' },
      ],
    }),
  ],
};
