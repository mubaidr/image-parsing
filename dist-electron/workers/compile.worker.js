module.exports =
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/utilities/workers/compile.worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__createBinding", function() { return __createBinding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
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
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ "./src/utilities/@classes/Cache.ts":
/*!*****************************************!*\
  !*** ./src/utilities/@classes/Cache.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Cache {
    constructor() {
        this.list = {};
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    get(key) {
        return this.list[key];
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    remove(key) {
        const t = this.list[key];
        delete this.list[key];
        return t;
    }
    reset() {
        this.list = {};
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    set(key, value) {
        this.list[key] = value;
        return value;
    }
}
exports.default = Cache;


/***/ }),

/***/ "./src/utilities/@classes/CompiledResult.ts":
/*!**************************************************!*\
  !*** ./src/utilities/@classes/CompiledResult.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const excel_1 = __webpack_require__(/*! ../excel */ "./src/utilities/excel.ts");
const Result_1 = tslib_1.__importDefault(__webpack_require__(/*! ./Result */ "./src/utilities/@classes/Result.ts"));
class CompiledResult {
    constructor() {
        this.keys = [];
        this.results = [];
        this.id = uuid_1.v4();
    }
    static export(compiledResult) {
        const obj = [];
        compiledResult
            .sortResults()
            .getResults()
            .forEach((result) => {
            obj.push(result.toJson());
        });
        return obj;
    }
    static loadFromExcel(src) {
        const rows = excel_1.importExcelToJson(src);
        const compiledResult = new CompiledResult();
        rows.forEach((row) => {
            const result = Result_1.default.fromJson(row);
            if (result.isKey()) {
                compiledResult.addKeys(result);
            }
            else {
                compiledResult.addResults(result);
            }
        });
        compiledResult.sortResults();
        return compiledResult;
    }
    static merge(compiledResults) {
        const compiledResult = new CompiledResult();
        compiledResults.forEach((cr) => {
            compiledResult
                .addKeys(cr.getKeys())
                .addResults(cr.getResults())
                .sortResults();
        });
        return compiledResult;
    }
    addFromExcel(src) {
        const rows = excel_1.importExcelToJson(src);
        rows.forEach((row) => {
            const result = Result_1.default.fromJson(row);
            if (result.isKey()) {
                this.addKeys(result);
            }
            else {
                this.addResults(result);
            }
        });
        this.sortResults();
        return this;
    }
    add(obj) {
        if (obj.isKey()) {
            const notAdded = this.keys.findIndex((key) => {
                return key.id === obj.id;
            }) === -1;
            if (notAdded)
                this.keys.push(obj);
        }
        else {
            this.results.push(obj);
        }
        return this;
    }
    addKeys(key) {
        if (key instanceof Result_1.default) {
            this.keys.push(key);
        }
        else {
            this.keys.push(...key);
        }
        return this;
    }
    addResults(result) {
        if (result instanceof Result_1.default) {
            this.results.push(result);
        }
        else {
            this.results.push(...result);
        }
        return this;
    }
    compile(marks, negativeMarks) {
        if (this.keys.length === 0)
            throw new Error('Keys not loaded');
        if (this.results.length === 0)
            throw new Error('Results not loaded');
        for (let i = 0; i < this.keys.length; i += 1) {
            for (let j = 0; j < this.results.length; j += 1) {
                this.results[j].compile(this.keys[i], marks, negativeMarks);
            }
        }
        return this;
    }
    export() {
        const obj = [];
        this.sortResults()
            .getResults()
            .forEach((result) => {
            obj.push(result.toJson());
        });
        return obj;
    }
    getKeyCount() {
        return this.keys.length;
    }
    getKeys() {
        return this.keys;
    }
    getResultCount() {
        return this.results.length;
    }
    getResults() {
        return this.results;
    }
    getKeysAndResults() {
        return [...this.results, ...this.keys];
    }
    reverseResults() {
        this.results.reverse();
        return this;
    }
    sortResults() {
        this.results.sort((a, b) => {
            return parseInt(a.rollNo || '0', 10) - parseInt(b.rollNo || '0', 10);
        });
        return this;
    }
    getRandomResults(percent) {
        const resultCount = this.getResultCount();
        const count = Math.max(Math.floor(((percent || 5) * resultCount) / 100), 1);
        const ids = [];
        const results = [];
        for (let i = 0; i < count;) {
            const index = Math.floor(Math.random() * resultCount);
            const result = this.results[index];
            if (ids.includes(result.id))
                continue;
            results.push(this.results[index]);
            ids.push(result.id);
            i += 1;
        }
        return results;
    }
}
exports.default = CompiledResult;


/***/ }),

/***/ "./src/utilities/@classes/Result.ts":
/*!******************************************!*\
  !*** ./src/utilities/@classes/Result.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const QuestionOptionsEnum_1 = tslib_1.__importDefault(__webpack_require__(/*! ../@enums/QuestionOptionsEnum */ "./src/utilities/@enums/QuestionOptionsEnum.ts"));
const RegExpPatterns_1 = tslib_1.__importDefault(__webpack_require__(/*! ../@enums/RegExpPatterns */ "./src/utilities/@enums/RegExpPatterns.ts"));
class Result {
    constructor(rollNo, imageFile) {
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.isCompiled = false;
        this.marks = 0;
        this.skippedCount = 0;
        this.totalMarks = 0;
        this.unattemptedCount = 0;
        this.answers = {};
        this.post = '';
        this.questionPaperType = '';
        this.testCenter = '';
        this.testTime = '';
        this.id = uuid_1.v4();
        this.rollNo = rollNo;
        this.imageFile = imageFile;
        this.isRollNoExtracted = !!rollNo;
    }
    static fromJson(o) {
        const answerRegExp = new RegExp(RegExpPatterns_1.default.QUESTION);
        const result = typeof o.rollNo === 'string' ? new Result(o.rollNo) : new Result();
        Object.keys(o).forEach((key) => {
            const value = o[key];
            if (answerRegExp.test(key)) {
                if (typeof value === 'string') {
                    result.addAnswer(key, value);
                }
                else {
                    result.addAnswer(key, '?');
                }
            }
            else {
                result[key] = value;
            }
        });
        return result;
    }
    addAnswer(title, value) {
        this.answers[title] = {
            value,
            unattempted: false,
            correct: false,
            skipped: false,
        };
        return this;
    }
    compile(key, marks, negativeMarks) {
        if (this.isCompiled)
            return this;
        if (!this.matchWithKey(key))
            return this;
        const props = Object.keys(key.answers);
        for (let k = 0; k < props.length; k += 1) {
            const prop = props[k];
            const keyChoice = key.answers[prop];
            const candidateChoice = this.answers[prop];
            // question not attempted
            if (candidateChoice.value === QuestionOptionsEnum_1.default.NONE) {
                candidateChoice.unattempted = true;
                this.unattemptedCount += 1;
            }
            // question skipped
            if (keyChoice.value === QuestionOptionsEnum_1.default.NONE ||
                keyChoice.value === QuestionOptionsEnum_1.default.MULTIPLE) {
                candidateChoice.skipped = true;
                this.skippedCount += 1;
                continue;
            }
            if (candidateChoice.value === keyChoice.value) {
                candidateChoice.correct = true;
                this.correctCount += 1;
            }
            else {
                candidateChoice.correct = false;
                this.incorrectCount += 1;
            }
        }
        this.isCompiled = true;
        if (marks && negativeMarks) {
            this.setMarks(marks, negativeMarks);
        }
        return this;
    }
    getCorrectCount() {
        return this.correctCount;
    }
    getInCorrectCount() {
        return this.incorrectCount;
    }
    getMarks() {
        return this.marks;
    }
    getSkippedCount() {
        return this.skippedCount;
    }
    getTotalMarks() {
        return this.totalMarks;
    }
    getUnattemptedCount() {
        return this.unattemptedCount;
    }
    hasImageFile() {
        return this.imageFile !== undefined;
    }
    hasValidRollNo() {
        return !this.isKey() && this.rollNo !== undefined;
    }
    isKey() {
        return (this.rollNo !== undefined && this.rollNo.trim().toLowerCase() === 'key');
    }
    isResult() {
        return !this.isKey();
    }
    matchWithKey(key) {
        return (this.post === key.post &&
            this.testCenter === key.testCenter &&
            this.testTime === key.testTime &&
            this.questionPaperType === key.questionPaperType);
    }
    setMarks(marks, negativeMarks) {
        this.marks = this.correctCount * marks - this.incorrectCount * negativeMarks;
        this.totalMarks = (60 - this.skippedCount) * marks;
        return this;
    }
    toJson() {
        const o = JSON.parse(JSON.stringify(this));
        for (const prop in o) {
            const value = o[prop];
            if (typeof value === 'object') {
                for (const subProp in value) {
                    o[subProp] = value[subProp].value;
                }
                delete o[prop];
            }
            else {
                o[prop] = value;
            }
        }
        return o;
    }
}
exports.default = Result;


/***/ }),

/***/ "./src/utilities/@classes/WorkerManager.ts":
/*!*************************************************!*\
  !*** ./src/utilities/@classes/WorkerManager.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerManager = exports.PROGRESS_STATES = void 0;
const child_process_1 = __webpack_require__(/*! child_process */ "child_process");
const events_1 = __webpack_require__(/*! events */ "events");
const os_1 = __webpack_require__(/*! os */ "os");
const design_1 = __webpack_require__(/*! ../design */ "./src/utilities/design.ts");
const images_1 = __webpack_require__(/*! ../images */ "./src/utilities/images.ts");
const CPU_COUNT = os_1.cpus().length;
var PROGRESS_STATES;
(function (PROGRESS_STATES) {
    PROGRESS_STATES["PROGRESS"] = "progress";
    PROGRESS_STATES["SUCCESS"] = "success";
})(PROGRESS_STATES = exports.PROGRESS_STATES || (exports.PROGRESS_STATES = {}));
var WORKER_TYPES;
(function (WORKER_TYPES) {
    WORKER_TYPES["COMPILE"] = "compile";
    WORKER_TYPES["EXTRACT"] = "extract";
    WORKER_TYPES["GENERATE"] = "generate";
})(WORKER_TYPES || (WORKER_TYPES = {}));
class WorkerManager extends events_1.EventEmitter {
    constructor() {
        super();
        this.data = [];
        this.workers = [];
        this.finished = 0;
        this.inputCount = 0;
    }
    async createWorkers(count, workerType) {
        await this.stop();
        for (let i = 0; i < count; i += 1) {
            const worker = child_process_1.fork(`./dist-electron/workers/${workerType}.worker.js`, [], {
                silent: true,
            });
            worker.on('message', (message) => {
                const { progressState, payload } = message;
                if (progressState === PROGRESS_STATES.PROGRESS) {
                    return this.emit(PROGRESS_STATES.PROGRESS);
                }
                if (progressState === PROGRESS_STATES.SUCCESS) {
                    this.finished += 1;
                    if (payload) {
                        this.data.push(payload);
                    }
                    if (this.finished === this.workers.length) {
                        this.emit(PROGRESS_STATES.SUCCESS, this.data);
                        this.stop();
                    }
                }
            });
            worker.on('exit', (code, signal) => {
                this.emit('exit', code, signal);
            });
            worker.on('error', (error) => {
                this.emit('error', error);
            });
            if (worker.stdout) {
                worker.stdout.on('data', (data) => {
                    // eslint-disable-next-line no-console
                    console.log(data.toString());
                    this.emit('log', data.toString());
                });
            }
            if (worker.stderr) {
                worker.stderr.on('data', (data) => {
                    // eslint-disable-next-line no-console
                    console.error(data.toString());
                    this.emit('error', new Error(data.toString()));
                });
            }
            this.workers.push(worker);
        }
    }
    async extract(directory, designID) {
        const designData = await design_1.getDesignData(designID);
        const totalImages = await images_1.getImagePaths(directory);
        const totalWorkers = Math.min(totalImages.length, CPU_COUNT);
        const step = Math.floor(totalImages.length / totalWorkers);
        this.inputCount = totalImages.length;
        await this.createWorkers(totalWorkers, WORKER_TYPES.EXTRACT);
        for (let i = 0; i < totalWorkers; i += 1) {
            const startIndex = i * step;
            const endIndex = i === totalWorkers - 1 ? totalImages.length : (i + 1) * step;
            this.workers[i].send({
                designData,
                imagePaths: totalImages.slice(startIndex, endIndex),
            });
        }
        return this;
    }
    async generate() {
        await this.createWorkers(CPU_COUNT, WORKER_TYPES.GENERATE);
        return this;
    }
    async compile() {
        await this.createWorkers(CPU_COUNT, WORKER_TYPES.COMPILE);
        return this;
    }
    async stop() {
        this.workers.forEach((w) => {
            w.kill('SIGKILL');
            w.unref();
        });
        this.finished = 0;
        this.data.length = 0;
        this.workers.length = 0;
        this.removeAllListeners();
        return this;
    }
}
exports.WorkerManager = WorkerManager;


/***/ }),

/***/ "./src/utilities/@enums/ImageNativeTypesEnum.ts":
/*!******************************************************!*\
  !*** ./src/utilities/@enums/ImageNativeTypesEnum.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ImageNativeTypesEnum;
(function (ImageNativeTypesEnum) {
    ImageNativeTypesEnum["bmp"] = "bmp";
    ImageNativeTypesEnum["gif"] = "gif";
    ImageNativeTypesEnum["jfif"] = "jfif";
    ImageNativeTypesEnum["jpe"] = "jpe";
    ImageNativeTypesEnum["jpeg"] = "jpeg";
    ImageNativeTypesEnum["jpg"] = "jpg";
    ImageNativeTypesEnum["png"] = "png";
    ImageNativeTypesEnum["svg"] = "svg";
    ImageNativeTypesEnum["webp"] = "webp";
})(ImageNativeTypesEnum || (ImageNativeTypesEnum = {}));
exports.default = ImageNativeTypesEnum;


/***/ }),

/***/ "./src/utilities/@enums/ImageTypesEnum.ts":
/*!************************************************!*\
  !*** ./src/utilities/@enums/ImageTypesEnum.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ImageTypesEnum;
(function (ImageTypesEnum) {
    ImageTypesEnum["bmp"] = "bmp";
    ImageTypesEnum["dib"] = "dib";
    ImageTypesEnum["gif"] = "gif";
    ImageTypesEnum["jfif"] = "jfif";
    ImageTypesEnum["jpe"] = "jpe";
    ImageTypesEnum["jpeg"] = "jpeg";
    ImageTypesEnum["jpg"] = "jpg";
    ImageTypesEnum["png"] = "png";
    ImageTypesEnum["svg"] = "svg";
    ImageTypesEnum["tif"] = "tif";
    ImageTypesEnum["tiff"] = "tiff";
    ImageTypesEnum["webp"] = "webp";
})(ImageTypesEnum || (ImageTypesEnum = {}));
exports.default = ImageTypesEnum;


/***/ }),

/***/ "./src/utilities/@enums/QuestionOptionsEnum.ts":
/*!*****************************************************!*\
  !*** ./src/utilities/@enums/QuestionOptionsEnum.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var QuestionOptionsEnum;
(function (QuestionOptionsEnum) {
    QuestionOptionsEnum["A"] = "A";
    QuestionOptionsEnum["B"] = "B";
    QuestionOptionsEnum["C"] = "C";
    QuestionOptionsEnum["D"] = "D";
    QuestionOptionsEnum["E"] = "E";
    QuestionOptionsEnum["MULTIPLE"] = "*";
    QuestionOptionsEnum["NONE"] = "?";
})(QuestionOptionsEnum || (QuestionOptionsEnum = {}));
exports.default = QuestionOptionsEnum;


/***/ }),

/***/ "./src/utilities/@enums/RegExpPatterns.ts":
/*!************************************************!*\
  !*** ./src/utilities/@enums/RegExpPatterns.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RegExpPattern;
(function (RegExpPattern) {
    RegExpPattern["BARCODE"] = "barcode$";
    RegExpPattern["NONE"] = "";
    RegExpPattern["OPTION"] = "q[1-9][0-9]?[a-e]$";
    RegExpPattern["QRCODE"] = "qrcode$";
    RegExpPattern["QUESTION"] = "q[1-9][0-9]?$";
})(RegExpPattern || (RegExpPattern = {}));
exports.default = RegExpPattern;


/***/ }),

/***/ "./src/utilities/cache.ts":
/*!********************************!*\
  !*** ./src/utilities/cache.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
const Cache_1 = tslib_1.__importDefault(__webpack_require__(/*! ./@classes/Cache */ "./src/utilities/@classes/Cache.ts"));
const cache = new Cache_1.default();
exports.cache = cache;


/***/ }),

/***/ "./src/utilities/dataPaths.ts":
/*!************************************!*\
  !*** ./src/utilities/dataPaths.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.dataPaths = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
const os_1 = tslib_1.__importDefault(__webpack_require__(/*! os */ "os"));
const path_1 = tslib_1.__importDefault(__webpack_require__(/*! path */ "path"));
const isDev = "development" === 'development';
const tmp = isDev ? path_1.default.resolve('.tmp') : os_1.default.tmpdir();
const home = path_1.default.join(os_1.default.homedir(), 'desktop');
const dataPaths = {
    design: path_1.default.resolve('tests', '_data', 'design.qr.svg'),
    designBarcode: path_1.default.resolve('tests', '_data', 'design.svg'),
    home,
    images: path_1.default.resolve('tests', '_data', 'images-qrcode'),
    imagesBarcode: path_1.default.resolve('tests', '_data', 'images-barcode'),
    key: path_1.default.resolve('tests', '_data', 'key.xlsx'),
    keyImage: path_1.default.resolve('tests', '_data', 'key.jpg'),
    questionsModel: isDev
        ? path_1.default.resolve('src/data/questions-model.json')
        : path_1.default.resolve('dist/data/questions-model.json'),
    result: path_1.default.resolve('tests', '_data', 'result.xlsx'),
    resultCompiled: path_1.default.resolve('tests', '_data', 'resultCompiled.xlsx'),
    root: path_1.default.resolve('.'),
    temp: tmp,
    tmp,
};
exports.dataPaths = dataPaths;


/***/ }),

/***/ "./src/utilities/design.ts":
/*!*********************************!*\
  !*** ./src/utilities/design.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getDesignData = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
const fast_xml_parser_1 = __webpack_require__(/*! fast-xml-parser */ "fast-xml-parser");
const fs_1 = __webpack_require__(/*! fs */ "fs");
const RegExpPatterns_1 = tslib_1.__importDefault(__webpack_require__(/*! ./@enums/RegExpPatterns */ "./src/utilities/@enums/RegExpPatterns.ts"));
const dataPaths_1 = __webpack_require__(/*! ./dataPaths */ "./src/utilities/dataPaths.ts");
function getDesignPathByID(id) {
    //TODO: implement internal store for designs with import/export functionality
    console.log(id);
    return dataPaths_1.dataPaths.designBarcode;
}
async function getDesignData(id) {
    const filePath = getDesignPathByID(id);
    const { svg } = fast_xml_parser_1.parse(fs_1.readFileSync(filePath).toString(), {
        attributeNamePrefix: '',
        ignoreAttributes: false,
        parseNodeValue: true,
        parseAttributeValue: true,
        allowBooleanAttributes: true,
    });
    // get width, height from viewbox
    const [x1, y1, x2, y2] = svg.viewBox
        .split(' ')
        .map((i) => parseInt(i, 10));
    const svgWidth = x2 - x1;
    const svgHeight = y2 - y1;
    // prepare pattern matching reg expressions
    const PATTERN_OPTION = new RegExp(RegExpPatterns_1.default.OPTION, 'i');
    const PATTERN_BARCODE = new RegExp(RegExpPatterns_1.default.BARCODE, 'i');
    const PATTERN_QRCODE = new RegExp(RegExpPatterns_1.default.QRCODE, 'i');
    // for export
    let code = { x: 0, y: 0, width: 0, height: 0 };
    const questions = {};
    svg.g.forEach((group) => {
        const { title, transform, rect } = group;
        if (!rect)
            return;
        const { rx, ry } = rect;
        let { x, y, width, height } = rect;
        let xTransform = 0;
        let yTransform = 0;
        if (transform) {
            ;
            [xTransform, yTransform] = transform
                .replace(/(translate)|\(|\)/gi, '')
                .split(',')
                .map((val) => parseInt(val, 10) || 0);
        }
        x = Math.floor(x - rx + xTransform - 3);
        y = Math.floor(y - ry + yTransform - 3);
        width = Math.ceil(width + rx + 6);
        height = Math.ceil(height + ry + 6);
        if (PATTERN_OPTION.test(title)) {
            const questionNumber = title.slice(0, -1);
            if (!questions[questionNumber]) {
                questions[questionNumber] = {
                    x: svgWidth,
                    y: svgHeight,
                    width: 0,
                    height: 0,
                };
            }
            questions[questionNumber].width += width;
            if (questions[questionNumber].x > x) {
                questions[questionNumber].x = x;
            }
            if (questions[questionNumber].y > y) {
                questions[questionNumber].y = y;
            }
            if (questions[questionNumber].width < width) {
                questions[questionNumber].width = width;
            }
            if (questions[questionNumber].height < height) {
                questions[questionNumber].height = height;
            }
        }
        else if (PATTERN_BARCODE.test(title) || PATTERN_QRCODE.test(title)) {
            code = { x, y, width, height };
        }
    });
    return {
        code,
        questions,
        width: svgWidth,
        height: svgHeight,
    };
}
exports.getDesignData = getDesignData;


/***/ }),

/***/ "./src/utilities/excel.ts":
/*!********************************!*\
  !*** ./src/utilities/excel.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.exportHtmltoExcel = exports.exportJsonToExcel = exports.importExcelToJson = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
const xlsx_1 = tslib_1.__importDefault(__webpack_require__(/*! xlsx */ "xlsx"));
const CompiledResult_1 = tslib_1.__importDefault(__webpack_require__(/*! ./@classes/CompiledResult */ "./src/utilities/@classes/CompiledResult.ts"));
const string_1 = __webpack_require__(/*! ./string */ "./src/utilities/string.ts");
const importExcelToJson = (src) => {
    const workbook = xlsx_1.default.readFile(src);
    const arr = [];
    Object.values(workbook.Sheets).forEach((sheet) => {
        const rows = xlsx_1.default.utils.sheet_to_json(sheet, {
            blankrows: false,
            raw: true,
        });
        for (let i = 0, rowsLength = rows.length; i < rowsLength; i += 1) {
            const row = rows[i];
            const keys = Object.keys(row);
            for (let j = 0, keysLength = keys.length; j < keysLength; j += 1) {
                const key = keys[j];
                const newKey = string_1.toCamelCase(key);
                if (newKey === key)
                    continue;
                row[newKey] = row[key];
                delete row[key];
            }
        }
        arr.push(...rows);
    });
    return arr;
};
exports.importExcelToJson = importExcelToJson;
function exportJsonToExcel(compiledResult, destination) {
    const workbook = xlsx_1.default.utils.book_new();
    const rows = compiledResult instanceof CompiledResult_1.default
        ? compiledResult.export()
        : compiledResult;
    for (let i = 0, rowsLength = rows.length; i < rowsLength; i += 1) {
        const row = rows[i];
        const keys = Object.keys(row);
        for (let j = 0, keysLength = keys.length; j < keysLength; j += 1) {
            const key = keys[j];
            const newKey = string_1.toHeadingCase(key);
            if (newKey === key)
                continue;
            row[newKey] = row[key];
            delete row[key];
        }
    }
    const worksheet = xlsx_1.default.utils.json_to_sheet(rows);
    xlsx_1.default.utils.book_append_sheet(workbook, worksheet);
    xlsx_1.default.writeFile(workbook, destination);
}
exports.exportJsonToExcel = exportJsonToExcel;
function exportHtmltoExcel(htmlTable, destination) {
    const wb = xlsx_1.default.utils.table_to_book(htmlTable);
    xlsx_1.default.writeFile(wb, destination);
}
exports.exportHtmltoExcel = exportHtmltoExcel;


/***/ }),

/***/ "./src/utilities/images.ts":
/*!*********************************!*\
  !*** ./src/utilities/images.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharpObjectFromSource = exports.logImageData = exports.getImagePaths = exports.convertImage = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
const fast_glob_1 = tslib_1.__importDefault(__webpack_require__(/*! fast-glob */ "fast-glob"));
const path_1 = tslib_1.__importDefault(__webpack_require__(/*! path */ "path"));
const sharp_1 = tslib_1.__importDefault(__webpack_require__(/*! sharp */ "sharp"));
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const ImageNativeTypesEnum_1 = tslib_1.__importDefault(__webpack_require__(/*! ./@enums/ImageNativeTypesEnum */ "./src/utilities/@enums/ImageNativeTypesEnum.ts"));
const ImageTypesEnum_1 = tslib_1.__importDefault(__webpack_require__(/*! ./@enums/ImageTypesEnum */ "./src/utilities/@enums/ImageTypesEnum.ts"));
const cache_1 = __webpack_require__(/*! ./cache */ "./src/utilities/cache.ts");
const dataPaths_1 = __webpack_require__(/*! ./dataPaths */ "./src/utilities/dataPaths.ts");
const getSharpObjectFromSource = (src) => {
    return sharp_1.default(src).raw().flatten();
};
exports.getSharpObjectFromSource = getSharpObjectFromSource;
const convertImage = async (src) => {
    if (!src) {
        throw new Error('Invalid source provided');
    }
    const ext = src.split('.').pop();
    // native supported images
    if (ext && ext in ImageNativeTypesEnum_1.default) {
        return src;
    }
    // check cache
    const cached = cache_1.cache.get(src);
    if (cached) {
        return cached;
    }
    // generate random tmp url
    const url = path_1.default.join(dataPaths_1.dataPaths.tmp, `${uuid_1.v4()}.jpg`);
    cache_1.cache.set(src, url);
    // save file for preview
    await getSharpObjectFromSource(src).jpeg().toFile(url);
    // returns new url
    return url;
};
exports.convertImage = convertImage;
const logImageData = async (src, name) => {
    let img;
    const target = path_1.default.join(dataPaths_1.dataPaths.tmp, `${name || uuid_1.v4()}.jpg`);
    if (typeof src === 'string') {
        img = getSharpObjectFromSource(src);
    }
    else {
        img = src.clone();
    }
    await img.jpeg().toFile(target);
    return target;
};
exports.logImageData = logImageData;
const getImagePaths = async (dir) => {
    const loc = dir.replace(/\\/g, '/');
    const exts = Object.keys(ImageTypesEnum_1.default);
    // avoid deep directory scan in test env
    const glob =  false
        ? undefined
        : `${loc}/**/*.{${exts}}`.replace('//', '/');
    return fast_glob_1.default(glob, {
        absolute: true,
        onlyFiles: true,
    });
};
exports.getImagePaths = getImagePaths;


/***/ }),

/***/ "./src/utilities/string.ts":
/*!*********************************!*\
  !*** ./src/utilities/string.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.toHeadingCase = exports.toCamelCase = void 0;
const toCamelCase = (s) => {
    return s
        .trim()
        .toLowerCase()
        .replace(/([-_ ][a-z])/gi, ($1) => {
        return $1.toUpperCase().replace(' ', '').replace('-', '').replace('_', '');
    });
};
exports.toCamelCase = toCamelCase;
const toHeadingCase = (s) => {
    return s
        .replace(/([A-Z])/g, ($1) => {
        return ' ' + $1;
    })
        .trim()
        .toUpperCase();
};
exports.toHeadingCase = toHeadingCase;


/***/ }),

/***/ "./src/utilities/workers/compile.worker.ts":
/*!*************************************************!*\
  !*** ./src/utilities/workers/compile.worker.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
const CompiledResult_1 = tslib_1.__importDefault(__webpack_require__(/*! ../@classes/CompiledResult */ "./src/utilities/@classes/CompiledResult.ts"));
const Result_1 = tslib_1.__importDefault(__webpack_require__(/*! ../@classes/Result */ "./src/utilities/@classes/Result.ts"));
const WorkerManager_1 = __webpack_require__(/*! ../@classes/WorkerManager */ "./src/utilities/@classes/WorkerManager.ts");
function sendMessage(obj) {
    if (process && process.send) {
        process.send(obj);
    }
}
function start(msg, isChildProcess) {
    const { results, keys, correctMarks, incorrectMarks } = msg;
    if (!results)
        throw new Error('Invalid results...');
    if (!keys)
        throw new Error('Invalid keys...');
    const compiledResult = new CompiledResult_1.default();
    results.forEach((result) => {
        compiledResult.addResults(Result_1.default.fromJson(result));
    });
    keys.forEach((key) => {
        compiledResult.addKeys(Result_1.default.fromJson(key));
    });
    compiledResult.compile(correctMarks, incorrectMarks);
    // report progress status
    if (isChildProcess) {
        sendMessage({
            state: WorkerManager_1.PROGRESS_STATES.PROGRESS,
            workerType: WORKER_TYPES.COMPILE,
            timeElapsed: 0,
        });
        sendMessage({
            state: WorkerManager_1.PROGRESS_STATES.SUCCESS,
            workerType: WorkerTypes.COMPILE,
            data: compiledResult.getKeysAndResults(),
        });
    }
    else {
        return compiledResult;
    }
}
function stop() {
    process.exit(0);
}
process.on('message', (msg) => {
    if (msg.stop) {
        stop();
    }
    else {
        start(msg, true);
    }
});
process.on('unhandledRejection', (error) => {
    console.error(error);
    stop();
});
process.on('uncaughtException', (error) => {
    console.error(error);
    stop();
});
process.on('warning', (warning) => {
    console.warn(warning);
});
exports.default = { start, stop };


/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "fast-glob":
/*!****************************!*\
  !*** external "fast-glob" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fast-glob");

/***/ }),

/***/ "fast-xml-parser":
/*!**********************************!*\
  !*** external "fast-xml-parser" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fast-xml-parser");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "sharp":
/*!************************!*\
  !*** external "sharp" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sharp");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("uuid");

/***/ }),

/***/ "xlsx":
/*!***********************!*\
  !*** external "xlsx" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("xlsx");

/***/ })

/******/ });