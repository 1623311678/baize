"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
// 创建Axios实例
var axiosInstance = axios_1.default.create({
    timeout: 10000, // 请求超时时间
});
// 请求拦截器
axiosInstance.interceptors.request.use(function (config) {
    // 从某个地方获取Token，例如从本地存储或上下文
    var token = localStorage.getItem('token'); // 替换为实际获取Token的逻
    if (token) {
        config.headers.Authorization = "Bearer ".concat(token);
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});
// 响应拦截器（可选）
axiosInstance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    // 处理响应错误，例如Token过期等
    return Promise.reject(error);
});
exports.default = axiosInstance;
