/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/backend.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/CHeightAPI.ts":
/*!**************************!*\
  !*** ./js/CHeightAPI.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var express = __webpack_require__(/*! express */ "express");
var fs = __webpack_require__(/*! fs */ "fs");
var CHeightAPI = /** @class */ (function () {
    function CHeightAPI() {
        this.data_source_path = './hoehe_test.csv';
        this.express = express();
        var csv_string = this.loadCSVFile();
        this.data = this.parseCSVString(csv_string);
        this.mountRoutes();
    }
    CHeightAPI.prototype.loadCSVFile = function () {
        process.stdout.write("Started loading data source: " + this.data_source_path + "... ");
        var csv_data = fs.readFileSync(this.data_source_path, 'utf8');
        process.stdout.write("OK (" + csv_data.length + " bytes)\n");
        return csv_data;
    };
    CHeightAPI.prototype.parseCSVString = function (csv_string) {
        csv_string = csv_string.replace(/^\s+|\s+$/g, ''); // trim newlines
        var rows = csv_string.split('\n');
        var matrix = [];
        for (var i = 0; i < rows.length; i++) {
            if (rows[i] === "") {
                rows.splice(i, 1);
                continue;
            }
            process.stdout.write("\r\u001B[KParse csv data... " + (i + 1) * 100 / rows.length + "%");
            var row = rows[i].split(',');
            matrix[i] = [];
            for (var j = 0; j < row.length; j++)
                matrix[i][j] = parseInt(row[j]);
        }
        // throw `CSV parse error: ${parse_results.errors}`;
        process.stdout.write("\nLoaded " + matrix.length + "x" + matrix[0].length + " Matrix\n");
        return matrix;
    };
    CHeightAPI.prototype.mountRoutes = function () {
        var router = express.Router();
        router.get('/', function (req, res) {
            res.json({ message: "Hello World" });
        });
        this.express.use('/', router);
    };
    return CHeightAPI;
}());
exports.default = new CHeightAPI().express;


/***/ }),

/***/ "./js/backend.ts":
/*!***********************!*\
  !*** ./js/backend.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CHeightAPI_1 = __webpack_require__(/*! ./CHeightAPI */ "./js/CHeightAPI.ts");
var port = process.env.PORT || 8080;
CHeightAPI_1.default.listen(port, function (err) {
    if (err) {
        return console.log(err);
    }
    return console.log("server is listening on " + port);
});


/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ })

/******/ });
//# sourceMappingURL=backend.js.map