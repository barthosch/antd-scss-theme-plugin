"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.replace");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileThemeVariables = exports.loadScssThemeAsLess = exports.extractLessVariables = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _less = _interopRequireDefault(require("less"));

var _scssToJson = _interopRequireDefault(require("scss-to-json"));

var _extractVariablesLessPlugin = _interopRequireDefault(require("./extractVariablesLessPlugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Return values of compiled Less variables from a compilable entry point.
 * @param {string} lessEntryPath - Root Less file from which to extract variables.
 * @param {Object} variableOverrides - Variable overrides of the form { '@var': 'value' } to use
 *   during compilation.
 * @return {Object} Object of the form { 'variable': 'value' }.
 */
const extractLessVariables = (lessEntryPath, variableOverrides = {}) => {
  const lessEntry = _fs.default.readFileSync(lessEntryPath, 'utf8');

  return new Promise( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (resolve, reject) {
      try {
        yield _less.default.render(lessEntry, {
          filename: lessEntryPath,
          javascriptEnabled: true,
          modifyVars: variableOverrides,
          plugins: [new _extractVariablesLessPlugin.default({
            callback: variables => resolve(variables)
          })]
        });
      } catch (error) {
        reject(error);
      }
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};
/**
 * Read variables from a SCSS theme file into an object with Less-style variable names as keys.
 * @param {string} themeScssPath - Path to SCSS file containing only SCSS variables.
 * @return {Object} Object of the form { '@variable': 'value' }.
 */


exports.extractLessVariables = extractLessVariables;

const loadScssThemeAsLess = themeScssPath => {
  let rawTheme;

  try {
    rawTheme = (0, _scssToJson.default)(themeScssPath);
  } catch (error) {
    throw new Error(`Could not compile the SCSS theme file "${themeScssPath}" for the purpose of variable ` + 'extraction. This is likely because it contains a Sass error.');
  }

  const theme = {};
  Object.keys(rawTheme).forEach(sassVariableName => {
    const lessVariableName = sassVariableName.replace(/^\$/, '@');
    theme[lessVariableName] = rawTheme[sassVariableName];
  });
  return theme;
};
/**
 * Use SCSS theme file to seed a full set of Ant Design's theme variables returned in SCSS.
 * @param {string} themeScssPath - Path to SCSS file containing SCSS variables meaningful to Ant
 *   Design.
 * @return {string} A string representing an SCSS file containing all the theme and color
 *   variables used in Ant Design.
 */


exports.loadScssThemeAsLess = loadScssThemeAsLess;

const compileThemeVariables = themeScssPath => {
  const themeEntryPath = require.resolve('antd/lib/style/themes/default.less');

  const variableOverrides = themeScssPath ? loadScssThemeAsLess(themeScssPath) : {};
  return extractLessVariables(themeEntryPath, variableOverrides).then(variables => Object.entries(variables).map(([name, value]) => `$${name}: ${value};\n`).join(''));
};

exports.compileThemeVariables = compileThemeVariables;