"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.get-own-property-descriptors");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = antdLessLoader;
exports.overloadLessLoaderOptions = void 0;

var _lessLoader = _interopRequireDefault(require("less-loader"));

var _loaderUtils = require("loader-utils");

var _utils = require("./utils");

var _loaderUtils2 = require("./loaderUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Modify less-loader's options with variable overrides extracted from the SCSS theme.
 * @param {Object} options - Options for less-loader.
 * @return {Object} Options modified to include theme variables in the modifyVars property.
 */
const overloadLessLoaderOptions = options => {
  const scssThemePath = (0, _loaderUtils2.getScssThemePath)(options);
  const themeModifyVars = (0, _utils.loadScssThemeAsLess)(scssThemePath);

  const newOptions = _objectSpread({}, options, {
    modifyVars: _objectSpread({}, themeModifyVars, {}, options.modifyVars || {})
  });

  return newOptions;
};
/**
 * A wrapper around less-loader which overloads loader options and registers the theme file
 * as a watched dependency.
 * @param {...*} args - Arguments passed to less-loader.
 * @return {*} The return value of less-loader, if any.
 */


exports.overloadLessLoaderOptions = overloadLessLoaderOptions;

function antdLessLoader(...args) {
  const loaderContext = this;
  const options = (0, _loaderUtils.getOptions)(loaderContext);

  const newLoaderContext = _objectSpread({}, loaderContext);

  try {
    const newOptions = overloadLessLoaderOptions(options);
    delete newOptions.scssThemePath;
    newLoaderContext.query = newOptions;
  } catch (error) {
    // Remove unhelpful stack from error.
    error.stack = undefined; // eslint-disable-line no-param-reassign

    throw error;
  }

  const scssThemePath = (0, _loaderUtils2.getScssThemePath)(options);
  newLoaderContext.addDependency(scssThemePath);
  return _lessLoader.default.call(newLoaderContext, ...args);
}