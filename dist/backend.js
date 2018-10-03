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
var fs = __webpack_require__(/*! fs */ "fs");
var CHeightAPIShared_1 = __webpack_require__(/*! ./CHeightAPIShared */ "./js/CHeightAPIShared.ts");
var CHeightAPI = /** @class */ (function () {
    function CHeightAPI() {
        this.data_source_path = './hoehe_test.csv';
        var csv_string = this.loadCSVFile();
        this.data = this.parseCSVString(csv_string);
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
    CHeightAPI.prototype.handleRequest = function (req, res, next) {
        var _a;
        // only hanle jsonapi requests
        if (req.header('Content-Type') !== "application/vnd.api+json") {
            next();
            return;
        }
        res.setHeader("Content-Type", "application/vnd.api+json");
        try {
            var lat = void 0, long = void 0, resolution = void 0, batchSize = void 0;
            _a = this.parseRequestParameter(req), lat = _a[0], long = _a[1], resolution = _a[2], batchSize = _a[3];
            var batchEdgeLength = Math.sqrt(batchSize);
            if (batchEdgeLength % 1 !== 0)
                throw "batch-size has to be a power of 2.";
            if (resolution === 0) { // pick resolution, that whole map fits in
                var maxEdgeLength = Math.max(this.data.length, this.data[0].length);
                var detailLevels = Math.ceil(this.getBaseLog(batchEdgeLength, maxEdgeLength)) - 1;
                resolution = Math.pow(batchEdgeLength, detailLevels);
            }
            var matrix = this.loadMapSubset(lat, long, resolution, batchEdgeLength);
            res.json({
                data: {
                    type: 'height-data',
                    id: resolution + "-" + batchSize + "-" + lat + "-" + long,
                    attributes: {
                        resolution: resolution,
                        'batch-size': batchSize,
                        matrix: matrix
                    }
                },
                meta: {
                    maxLat: this.data.length,
                    maxLong: this.data[0].length
                }
            });
        }
        catch (err) {
            if (typeof err === 'string') {
                res.status(400);
                res.json({
                    errors: [{ 'title': err }]
                });
            }
            else {
                res.status(500);
                res.json({
                    errors: [{
                            title: err.toString(),
                            meta: {
                                message: err.message,
                                stack: err.stack
                            }
                        }]
                });
                throw err;
            }
        }
    };
    // checks that every parameter is present
    CHeightAPI.prototype.parseRequestParameter = function (req) {
        var req_params = Object.keys(req.query);
        // check if params are present
        if (!['lat', 'long', 'resolution', 'batch-size'].every(function (val) { return req_params.includes(val); }))
            throw "Missing parameter. Provide 'lat', 'long', 'resolution and 'batch-size'.";
        var params_str = [req.query.lat, req.query.long, req.query.resolution, req.query['batch-size']];
        // convert params to int
        var params_int = params_str.map(function (val) {
            var integer = parseInt(val);
            if (isNaN(integer))
                throw "All parameters have to be integers: " + val;
            return integer;
        });
        return params_int;
    };
    CHeightAPI.prototype.loadMapSubset = function (lat, long, resolution, batchEdgeLength) {
        var matrix = [];
        for (var y = 0, ilat = lat; y <= batchEdgeLength; y++, ilat += resolution) {
            matrix[y] = [];
            for (var x = 0, ilong = long; x <= batchEdgeLength; x++, ilong += resolution) {
                matrix[y][x] = this.getDataPoint(ilat, ilong);
            }
        }
        return matrix;
    };
    CHeightAPI.prototype.getDataPoint = function (lat, long) {
        var height = -1;
        if (lat >= 0 && lat < this.data.length &&
            long >= 0 && long < this.data[0].length)
            height = this.data[lat][long];
        return new CHeightAPIShared_1.default(lat, long, height);
    };
    CHeightAPI.prototype.getBaseLog = function (base, val) {
        return Math.log(val) / Math.log(base);
    };
    return CHeightAPI;
}());
exports.default = CHeightAPI;


/***/ }),

/***/ "./js/CHeightAPIShared.ts":
/*!********************************!*\
  !*** ./js/CHeightAPIShared.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var three_1 = __webpack_require__(/*! three */ "three");
var DataPoint = /** @class */ (function () {
    function DataPoint(lat, long, height) {
        this.lat = lat;
        this.long = long;
        this.height = height;
    }
    DataPoint.load = function (obj) {
        return new DataPoint(obj.lat, obj.long, obj.height);
    };
    DataPoint.prototype.equals = function (other) {
        return (this.lat === other.lat &&
            this.long === other.long &&
            this.height === other.height);
    };
    DataPoint.prototype.vector3 = function () {
        //TODO: move scale to backend
        return new three_1.Vector3(this.long, this.height / 1000.0, this.lat);
    };
    DataPoint.prototype.isInMap = function () {
        return (this.height > 0);
    };
    return DataPoint;
}());
exports.default = DataPoint;


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
var express = __webpack_require__(/*! express */ "express");
var api = new CHeightAPI_1.default();
var port = process.env.PORT || 8080;
var app = express();
var router = express.Router();
router.get('/', api.handleRequest.bind(api));
app.use('/', router);
app.use(express.static('.'));
app.listen(port, function (err) {
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

/***/ }),

/***/ "three":
/*!************************!*\
  !*** external "three" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("three");

/***/ })

/******/ });
//# sourceMappingURL=backend.js.map