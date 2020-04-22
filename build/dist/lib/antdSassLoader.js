"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.get-own-property-descriptors");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = antdSassLoader;
exports.overloadSassLoaderOptions = exports.themeImporter = void 0;

var _path = _interopRequireDefault(require("path"));

var _loaderUtils = require("loader-utils");

var _sassLoader = _interopRequireDefault(require("sass-loader"));

var _importsToResolve = _interopRequireDefault(require("sass-loader/dist/importsToResolve"));

var _loaderUtils2 = require("./loaderUtils");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Utility returning a node-sass importer that provides access to all of antd's theme variables.
 * @param {string} themeScssPath - Path to SCSS file containing Ant Design theme variables.
 * @param {string} contents - The compiled content of the SCSS file at themeScssPath.
 * @returns {function} Importer that provides access to all compiled Ant Design theme variables
 *   when importing the theme file at themeScssPath.
 */
const themeImporter = (themeScssPath, contents) => (url, previousResolve, done) => {
  const request = (0, _loaderUtils.urlToRequest)(url);
  const pathsToTry = (0, _importsToResolve.default)(request);

  const baseDirectory = _path.default.dirname(previousResolve);

  for (let i = 0; i < pathsToTry.length; i += 1) {
    const potentialResolve = pathsToTry[i];

    if (_path.default.resolve(baseDirectory, potentialResolve) === themeScssPath) {
      done({
        contents
      });
      return;
    }
  }

  done();
};
/**
 * Modify sass-loader's options so that all antd variables are imported from the SCSS theme file.
 * @param {Object} options - Options for sass-loader.
 * @return {Object} Options modified to includ a custom importer that handles the SCSS theme file.
 */


exports.themeImporter = themeImporter;

const overloadSassLoaderOptions = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (options) {
    const newOptions = _objectSpread({}, options);

    const scssThemePath = (0, _loaderUtils2.getScssThemePath)(options);
    const contents = yield (0, _utils.compileThemeVariables)(scssThemePath);
    const extraImporter = themeImporter(scssThemePath, contents);
    let importer;

    if ('importer' in options) {
      if (Array.isArray(options.importer)) {
        importer = [...options.importer, extraImporter];
      } else {
        importer = [options.importer, extraImporter];
      }
    } else {
      importer = extraImporter;
    }

    newOptions.importer = importer;
    return newOptions;
  });

  return function overloadSassLoaderOptions(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * A wrapper around sass-loader which overloads loader options to include a custom importer handling
 * variable imports from the SCSS theme file, and registers the theme file as a watched dependency.
 * @param {...*} args - Arguments passed to sass-loader.
 * @return {undefined}
 */


exports.overloadSassLoaderOptions = overloadSassLoaderOptions;

function antdSassLoader(...args) {
  const loaderContext = this;
  const callback = loaderContext.async();
  const options = (0, _loaderUtils.getOptions)(loaderContext);

  const newLoaderContext = _objectSpread({}, loaderContext);

  overloadSassLoaderOptions(options).then(newOptions => {
    delete newOptions.scssThemePath; // eslint-disable-line no-param-reassign

    newLoaderContext.query = newOptions;
    const scssThemePath = (0, _loaderUtils2.getScssThemePath)(options);
    newLoaderContext.addDependency(scssThemePath);
    return _sassLoader.default.call(newLoaderContext, ...args);
  }).catch(error => {
    // Remove unhelpful stack from error.
    error.stack = undefined; // eslint-disable-line no-param-reassign

    callback(error);
  });
}