webpackJsonp([0],{

/***/ 210:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(18);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(415);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouterDom = __webpack_require__(202);

var _routes = __webpack_require__(212);

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import './styles/index.scss';

_reactDom2.default.render(_react2.default.createElement(
  _reactRouterDom.BrowserRouter,
  null,
  _react2.default.createElement(_routes2.default, null)
), document.getElementById('react-app'));

/***/ }),

/***/ 212:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(18);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(202);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Page1 = function Page1() {
  return _react2.default.createElement(
    'div',
    null,
    'page 1'
  );
};
var Page2 = function Page2() {
  return _react2.default.createElement(
    'div',
    null,
    'page 2'
  );
};

var routes = function routes() {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      _reactRouterDom.Switch,
      null,
      _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/', component: Page1 }),
      _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/page2', component: Page2 })
    )
  );
};

exports.default = routes;

/***/ }),

/***/ 522:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(211);
module.exports = __webpack_require__(210);


/***/ })

},[522]);
//# sourceMappingURL=client.bundle-1f903782698eec4f0910.js.map