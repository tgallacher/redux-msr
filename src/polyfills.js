// We include this here (instead of in our Webpack config) so that
// `babel-preset-env` and our `.babelrc` config will only include
// the polyfills which are needed, based on our target browsers.
//
// NB: currently (BabelJS v6.x), this will also include polyfills
// which may not be required for this bundle.
require('babel-polyfill');
