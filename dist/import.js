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
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/import.ts");
/******/ })
/************************************************************************/
/******/ ({

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
        return new three_1.Vector3(this.long, this.height / 50.0, this.lat);
    };
    DataPoint.prototype.isInMap = function () {
        return DataPoint.isInMap(this.height);
    };
    DataPoint.isInMap = function (height) {
        return (height > 100);
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
                                _this.db.exec("\n                DROP TABLE IF EXISTS " + _this.db_data_table_name + ";\n                CREATE TABLE " + _this.db_data_table_name + " (\n                    lat INTEGER,\n                    long INTEGER,\n                    height INTEGER,\n                    PRIMARY KEY (lat, long)\n                );", function (err) {
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
    HeightMapDataStore.prototype.loadMetadata = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (_this.metadata) {
                            resolve(_this.metadata);
                            return;
                        }
                        _this.db.get("SELECT MIN(lat) as minLat,\n                                    MAX(lat) as maxLat,\n                                    MIN(long) as minLong,\n                                    MAX(long) as maxLong,\n                                    MIN(height) as minHeight,\n                                    MAX(height) as maxHeight\n                                    FROM " + _this.db_data_table_name + ";", function (err, row) {
                            if (err)
                                reject(err);
                            else {
                                _this.metadata = row;
                                resolve(_this.metadata);
                            }
                        });
                    })];
            });
        });
    };
    return HeightMapDataStore;
}());
exports.default = HeightMapDataStore;


/***/ }),

/***/ "./js/import.ts":
/*!**********************!*\
  !*** ./js/import.ts ***!
  \**********************/
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
var HeightMapDataStore_1 = __webpack_require__(/*! ./HeightMapDataStore */ "./js/HeightMapDataStore.ts");
var fs = __webpack_require__(/*! fs */ "fs");
var CHeightAPIShared_1 = __webpack_require__(/*! ./CHeightAPIShared */ "./js/CHeightAPIShared.ts");
var data_source_path = './hoehe_ch.csv';
function loadFromCSV() {
    return __awaiter(this, void 0, void 0, function () {
        var csv_string, rows, i, row, row_data, j, height;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    process.stdout.write("Started loading data source file: " + data_source_path + "... ");
                    csv_string = fs.readFileSync(data_source_path, 'utf8');
                    process.stdout.write("OK (" + csv_string.length + " bytes)\n");
                    csv_string = csv_string.replace(/^\s+|\s+$/g, ''); // trim newlines
                    rows = csv_string.split('\n');
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < rows.length)) return [3 /*break*/, 4];
                    if (rows[i] === "")
                        return [3 /*break*/, 3];
                    process.stdout.write("\r\u001B[KParse csv data... [" + (i + 1) + "/" + rows.length + "] " + (i + 1) * 100 / rows.length + "%");
                    row = rows[i].split(',');
                    row_data = [];
                    for (j = 0; j < row.length; j++) {
                        height = parseInt(row[j]);
                        if (CHeightAPIShared_1.default.isInMap(height)) {
                            row_data.push([i, j, height]);
                        }
                    }
                    return [4 /*yield*/, store.storeAll(row_data)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    // throw `CSV parse error: ${parse_results.errors}`;
                    process.stdout.write("\nLoaded Matrix\n");
                    return [2 /*return*/];
            }
        });
    });
}
var store = new HeightMapDataStore_1.default();
store.connect().then(function () {
    console.log('connected');
    return store.resetDB();
}).then(function () {
    console.log('db reset');
    return loadFromCSV();
}).then(function () {
    console.log('Done.');
});


/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

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
//# sourceMappingURL=import.js.map