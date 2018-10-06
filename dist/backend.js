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

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var CHeightAPIShared_1 = __webpack_require__(/*! ./CHeightAPIShared */ "./js/CHeightAPIShared.ts");
var HeightMapDataStore_1 = __webpack_require__(/*! ./HeightMapDataStore */ "./js/HeightMapDataStore.ts");
var CHeightAPI = /** @class */ (function () {
    function CHeightAPI() {
        var _this = this;
        this.store = new HeightMapDataStore_1.default();
        this.store.connect().then(function () {
            console.log('connected');
            return _this.store.loadMetadata();
        }).then(function (res) {
            console.log('metadata loaded');
            _this.metadata = res;
        });
    }
    CHeightAPI.prototype.handleRequest = function (req, res, next) {
        var _this = this;
        var _a;
        // only hanle jsonapi requests
        if (req.header('Content-Type') !== "application/vnd.api+json") {
            next();
            return;
        }
        res.setHeader("Content-Type", "application/vnd.api+json");
        try {
            var lat_1, long_1, resolution_1, batchSize_1;
            _a = this.parseRequestParameter(req), lat_1 = _a[0], long_1 = _a[1], resolution_1 = _a[2], batchSize_1 = _a[3];
            var batchEdgeLength = Math.sqrt(batchSize_1);
            if (batchEdgeLength % 1 !== 0)
                throw "batch-size has to be a power of 2.";
            if (resolution_1 === 0) { // pick resolution, that whole map fits in
                var maxEdgeLength = Math.max(this.metadata.maxLat, this.metadata.maxLong);
                var detailLevels = Math.ceil(CHeightAPI.getBaseLog(batchEdgeLength, maxEdgeLength)) - 1;
                resolution_1 = Math.pow(batchEdgeLength, detailLevels);
            }
            this.loadMapSubset(lat_1, long_1, resolution_1, batchEdgeLength).then(function (data) {
                res.json({
                    data: {
                        type: 'height-data',
                        id: resolution_1 + "-" + batchSize_1 + "-" + lat_1 + "-" + long_1,
                        attributes: {
                            resolution: resolution_1,
                            'batch-size': batchSize_1,
                            matrix: data
                        }
                    },
                    meta: {
                        maxLat: _this.metadata.maxLat,
                        maxLong: _this.metadata.maxLong
                    }
                });
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
        return __awaiter(this, void 0, void 0, function () {
            var matrix, y, ilat, x, ilong, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        matrix = [];
                        y = 0, ilat = lat;
                        _c.label = 1;
                    case 1:
                        if (!(y <= batchEdgeLength)) return [3 /*break*/, 6];
                        matrix[y] = [];
                        x = 0, ilong = long;
                        _c.label = 2;
                    case 2:
                        if (!(x <= batchEdgeLength)) return [3 /*break*/, 5];
                        _a = matrix[y];
                        _b = x;
                        return [4 /*yield*/, this.getDataPoint(ilat, ilong)];
                    case 3:
                        _a[_b] = _c.sent();
                        _c.label = 4;
                    case 4:
                        x++, ilong += resolution;
                        return [3 /*break*/, 2];
                    case 5:
                        y++, ilat += resolution;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, matrix];
                }
            });
        });
    };
    CHeightAPI.prototype.getDataPoint = function (lat, long) {
        return __awaiter(this, void 0, void 0, function () {
            var height;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        height = -1;
                        if (!(lat >= this.metadata.minLat && lat <= this.metadata.maxLat &&
                            long >= this.metadata.minLong && long <= this.metadata.maxLong)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.store.get(lat, long)];
                    case 1:
                        height = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, new CHeightAPIShared_1.default(lat, long, height)];
                }
            });
        });
    };
    CHeightAPI.getBaseLog = function (base, val) {
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
var HeightMapMetadata = /** @class */ (function () {
    function HeightMapMetadata() {
    }
    return HeightMapMetadata;
}());
exports.HeightMapMetadata = HeightMapMetadata;
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
        return DataPoint.isInMap(this.height);
    };
    DataPoint.isInMap = function (height) {
        return (height > 2);
    };
    return DataPoint;
}());
exports.default = DataPoint;


/***/ }),

/***/ "./js/HeightMapDataStore.ts":
/*!**********************************!*\
  !*** ./js/HeightMapDataStore.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3_1 = __webpack_require__(/*! sqlite3 */ "sqlite3");
var HeightMapDataStore = /** @class */ (function () {
    function HeightMapDataStore() {
        this.db_file = './heightdata.db';
        this.db_data_table_name = 'heightdata';
        this.db_meta_table_name = 'metadata';
    }
    HeightMapDataStore.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            _this.db = new sqlite3_1.Database(_this.db_file, function (err) {
                                if (err)
                                    reject(err);
                                else
                                    resolve();
                            });
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeightMapDataStore.prototype.checkConnected = function () {
        if (!this.db)
            throw "Database not connected.";
    };
    HeightMapDataStore.prototype.resetDB = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkConnected();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.db.exec("\n                DROP TABLE IF EXISTS " + _this.db_data_table_name + ";\n                DROP TABLE IF EXISTS " + _this.db_meta_table_name + ";\n                CREATE TABLE " + _this.db_data_table_name + " (\n                    lat INTEGER,\n                    long INTEGER,\n                    height INTEGER,\n                    PRIMARY KEY (lat, long)\n                );\n                CREATE TABLE " + _this.db_meta_table_name + " (\n                    table_name TEXT PRIMARY KEY,\n                    minLat INTEGER,\n                    maxLat INTEGER,\n                    minLong INTEGER,\n                    maxLong INTEGER \n                );", function (err) {
                                    if (err)
                                        reject(err);
                                    else
                                        resolve();
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeightMapDataStore.prototype.storeAll = function (rawPoints) {
        return __awaiter(this, void 0, void 0, function () {
            var query, query_parts, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkConnected();
                        if (rawPoints.length === 0)
                            return [2 /*return*/];
                        query = "INSERT INTO " + this.db_data_table_name + " VALUES ";
                        query_parts = [];
                        for (i = 0; i < rawPoints.length; i++) {
                            query_parts[i] = "(" + rawPoints[i][0] + ", " + rawPoints[i][1] + ", " + rawPoints[i][2] + ")";
                        }
                        query += query_parts.join(', ') + ';';
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.db.run(query, function (err) {
                                    if (err)
                                        reject(err);
                                    else
                                        resolve();
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeightMapDataStore.prototype.store = function (point) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkConnected();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.db.run("INSERT INTO " + _this.db_data_table_name + " VALUES ($lat, $long, $height);", {
                                    $lat: point.lat,
                                    $long: point.long,
                                    $height: point.height
                                }, function (err) {
                                    if (err)
                                        reject(err);
                                    else
                                        resolve();
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeightMapDataStore.prototype.get = function (lat, long) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.get("SELECT height FROM " + _this.db_data_table_name + " WHERE lat = " + lat + " AND long = " + long + ";", function (err, row) {
                            if (err)
                                reject(err);
                            else if (!row)
                                resolve(-1);
                            else
                                resolve(row.height);
                        });
                    })];
            });
        });
    };
    HeightMapDataStore.prototype.storeMeta = function (minLat, maxLat, minLong, maxLong) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkConnected();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.db.run("INSERT INTO " + _this.db_meta_table_name + " VALUES (\"" + _this.db_data_table_name + "\", $minLat, $maxLat, $minLong, $maxLong);", {
                                    $minLat: minLat,
                                    $maxLat: maxLat,
                                    $minLong: minLong,
                                    $maxLong: maxLong
                                }, function (err) {
                                    if (err)
                                        reject(err);
                                    else
                                        resolve();
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeightMapDataStore.prototype.loadMetadata = function (table_name) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!table_name)
                    table_name = this.db_data_table_name;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.get("SELECT minLat, maxLat, minLong, maxLong FROM " + _this.db_meta_table_name + " WHERE table_name = \"" + table_name + "\"", function (err, row) {
                            if (err)
                                reject(err);
                            else
                                resolve(row);
                        });
                    })];
            });
        });
    };
    return HeightMapDataStore;
}());
exports.default = HeightMapDataStore;


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

/***/ "sqlite3":
/*!**************************!*\
  !*** external "sqlite3" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sqlite3");

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