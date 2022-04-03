"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkwordle"] = self["webpackChunkwordle"] || []).push([["src_components_helpers_js"],{

/***/ "./src/components/helpers.js":
/*!***********************************!*\
  !*** ./src/components/helpers.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"helpers\": () => (/* binding */ helpers)\n/* harmony export */ });\nvar helpers = {\n  createNode: function createNode(elementType) {\n    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;\n    var element = document.createElement(elementType);\n\n    for (var prop in props) {\n      if (prop) element[prop] = props[prop];\n    }\n\n    return element;\n  }\n};\n\n//# sourceURL=webpack://wordle/./src/components/helpers.js?");

/***/ })

}]);