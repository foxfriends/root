/* eslint-disable */
import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';
import eslint from '@rollup/plugin-eslint';
import babel from '@rollup/plugin-babel';
import url from '@rollup/plugin-url';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';

const production = !process.env.ROLLUP_WATCH;

// noinspection JSUnusedGlobalSymbols,JSValidateTypes
export default {
  input: 'app/index.ts',
  output: {
    dir: 'dist/',
    format: 'iife',
    name: 'app',
    sourcemap: true,
  },
  watch: {
    include: ['app/**', 'model/**'],
  },

  plugins: [
    // allows use node-style directory import (omitting /index part)
    nodeResolve(),
    commonjs(),

    url({
      include: ['**/*.svg', '**/*.png', '**/*.jp(e)?g', '**/*.gif', '**/*.webp', '**/*.ftl'],
    }),

    eslint({
      include: ['app/**/*.js', 'app/**/*.ts', 'app/**/*.svelte'],
    }),

    svelte({
      // Extract CSS into a single bundled file (recommended).
      css: css => {
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
        // postcss: {
        //   plugins: [
        //     require('postcss-import'),
        //     require('stylelint'),
        //   ],
        // },
      }),
    }),

    // serves and updates files
    serve({
      contentBase: 'dist',
      port: 3000,
    }),

    // reloads page during serve after every code change
    !production && livereload(),

    babel({
      extensions: ['.js', '.mjs', '.html', '.svelte'],
      babelHelpers: 'runtime',
      exclude: ['node_modules/@babel/**'],
      presets: [
        ['@babel/preset-env', {
          targets: {
            esmodules: true,
          },
        }],
      ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-private-methods',
        '@babel/plugin-proposal-function-bind',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
        ['@babel/plugin-transform-runtime', {
          useESModules: true,
        }],
      ],
    }),

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
