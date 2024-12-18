"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var request_1 = require("./lib/request");
var uv_1 = require("./lib/uv");
var MonitoringSDK = /** @class */ (function () {
    function MonitoringSDK(options) {
        var domain = options.domain;
        this.domain = domain;
        this.endpoint = "".concat(this.domain, "/api/report");
        this.pvApi = "".concat(this.domain, "/api/pv");
        this.originalConsoleError = console.error; // 保存原始的 console.error 方法
        //pv
        this.init();
    }
    MonitoringSDK.prototype.report = function (options) {
        var message = options.message, _a = options.type, type = _a === void 0 ? "javascript" : _a, level = options.level;
        var poyload = {
            message: message,
            stack: "",
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            type: type,
        };
        (0, request_1.postData)(this.endpoint, poyload);
    };
    MonitoringSDK.prototype.init = function () {
        window.addEventListener("error", this.handleErrorEvent.bind(this));
        window.addEventListener("error", this.handleErrorResource.bind(this), true);
        window.addEventListener("unhandledrejection", this.handlePromiseRejection.bind(this));
        this.overrideConsoleError(); // 重写 console.error
        this.handlePv();
        this.handleUv();
    };
    MonitoringSDK.prototype.handleUv = function () {
        var _this = this;
        document.addEventListener("DOMContentLoaded", function () {
            (0, uv_1.recordDailyVisit)({ api: "".concat(_this.domain, "/api/user-view/record") });
        });
    };
    MonitoringSDK.prototype.handlePv = function () {
        var _this = this;
        document.addEventListener("DOMContentLoaded", this.trackPageView.bind(this));
        // 监听popstate事件
        window.addEventListener("popstate", function (e) {
            _this.trackPageView();
        });
        window.addEventListener("hashchange", function () {
            _this.trackPageView();
        });
        (function (history) {
            var pushState = history.pushState;
            var replaceState = history.replaceState;
            history.pushState = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var result = pushState.apply(history, args);
                window.dispatchEvent(new Event("popstate"));
                return result;
            };
            history.replaceState = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var result = replaceState.apply(history, args);
                window.dispatchEvent(new Event("popstate"));
                return result;
            };
        })(window.history);
    };
    MonitoringSDK.prototype.handleErrorEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var errorReport;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (event.target instanceof HTMLImageElement ||
                            event.target instanceof HTMLScriptElement ||
                            event.target instanceof HTMLLinkElement) {
                            // 处理静态资源加载错误
                            errorReport = {
                                message: "Failed to load resource: ".concat(event.target.tagName.toLowerCase(), " at ").concat(((_a = event.target) === null || _a === void 0 ? void 0 : _a.src) || ((_b = event.target) === null || _b === void 0 ? void 0 : _b.href)),
                                stack: "",
                                url: window.location.href,
                                userAgent: navigator.userAgent,
                                timestamp: new Date().toISOString(),
                                type: "resource(静态资源)",
                            };
                        }
                        else {
                            // 处理JavaScript错误
                            errorReport = {
                                message: event.message,
                                stack: ((_c = event.error) === null || _c === void 0 ? void 0 : _c.stack) || "",
                                url: window.location.href,
                                userAgent: navigator.userAgent,
                                timestamp: new Date().toISOString(),
                                type: "javascript",
                            };
                        }
                        return [4 /*yield*/, this.reportError(errorReport)];
                    case 1:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MonitoringSDK.prototype.handlePromiseRejection = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var errorReport;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        errorReport = {
                            message: ((_a = event.reason) === null || _a === void 0 ? void 0 : _a.message) || "Unhandled Rejection",
                            stack: ((_b = event.reason) === null || _b === void 0 ? void 0 : _b.stack) || "",
                            url: window.location.href,
                            userAgent: navigator.userAgent,
                            timestamp: new Date().toISOString(),
                            type: "javascript",
                        };
                        return [4 /*yield*/, this.reportError(errorReport)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MonitoringSDK.prototype.overrideConsoleError = function () {
        var _this = this;
        console.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var message = args
                .map(function (arg) { return (typeof arg === "string" ? arg : JSON.stringify(arg)); })
                .join(" ");
            // 检查消息内容，过滤掉包含 "Warning" 的信息
            if (/warning/i.test(message)) {
                // 直接调用原始的 console.error 方法，不上报此类警告
                _this.originalConsoleError.apply(console, args);
                return;
            }
            var errorReport = {
                message: message,
                stack: "", // console.error 通常不会有 stack trace
                url: window.location.href,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                type: "javascript",
            };
            // 异步上报错误信息，确保不会阻塞 console.error 的执行
            _this.reportError(errorReport).catch(function (err) {
                // 上报失败时，仍然调用原始的 console.error 方法
                _this.originalConsoleError("Failed to report error:", err);
            });
            // 调用原始的 console.error 方法
            _this.originalConsoleError.apply(console, args);
        };
    };
    MonitoringSDK.prototype.handleErrorResource = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var errorReport;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!(event.target instanceof HTMLScriptElement ||
                            event.target instanceof HTMLLinkElement ||
                            event.target instanceof HTMLImageElement)) return [3 /*break*/, 2];
                        errorReport = {
                            message: "Failed to load resource: ".concat((_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.tagName.toLowerCase(), " from ").concat(((_b = event === null || event === void 0 ? void 0 : event.target) === null || _b === void 0 ? void 0 : _b.src) || ((_c = event === null || event === void 0 ? void 0 : event.target) === null || _c === void 0 ? void 0 : _c.href)),
                            stack: ((_d = event.error) === null || _d === void 0 ? void 0 : _d.stack) || "",
                            url: window.location.href,
                            userAgent: navigator.userAgent,
                            timestamp: new Date().toISOString(),
                            type: "resource(静态资源)",
                        };
                        return [4 /*yield*/, this.reportError(errorReport)];
                    case 1:
                        _e.sent();
                        _e.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    MonitoringSDK.prototype.trackPageView = function () {
        var url = "";
        var pWin = window;
        if (pWin.location.hash) {
            url = "".concat(window.location.origin).concat(window.location.pathname).concat(window.location.hash);
        }
        else {
            url = "".concat(window.location.origin).concat(window.location.pathname);
        }
        var pageViewReport = {
            type: "pageview",
            message: "Page viewed",
            stack: "",
            url: url,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
        };
        // 上报PV信息
        this.reportPageView(pageViewReport);
    };
    MonitoringSDK.prototype.reportPageView = function (pageViewReport) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, request_1.postData)(this.pvApi, pageViewReport)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MonitoringSDK.prototype.reportError = function (errorReport) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, request_1.postData)(this.endpoint, errorReport)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return MonitoringSDK;
}());
exports.default = MonitoringSDK;
