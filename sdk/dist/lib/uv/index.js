"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordDailyVisit = recordDailyVisit;
var request_1 = require("../request");
function getUserIdentifier() {
    var userId = localStorage.getItem("userId");
    var token = localStorage.getItem("token");
    if (!userId) {
        userId = generateUUID();
        localStorage.setItem("userId", userId);
    }
    if (token) {
        return undefined;
    }
    else {
        return userId;
    }
}
function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
function recordDailyVisit(options) {
    var api = options.api;
    var userId = getUserIdentifier();
    var pageUrl = window.location.href;
    // 发送请求记录访问
    (0, request_1.postData)(api, {
        pageUrl: pageUrl,
        userId: userId,
    })
        .then(function (response) {
        console.log("Daily visit recorded:", response.data);
    })
        .catch(function (error) {
        console.error("Error recording daily visit:", error);
    });
}
