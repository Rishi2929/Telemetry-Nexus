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
var BASE_URL = "http://localhost:3001";
var TOTAL_REQUESTS = 500;
var ENDPOINTS = [
    { path: "/", method: "GET", weight: 30 },
    // Successful requests
    { path: "/fast", method: "GET", weight: 20 },
    { path: "/slow", method: "GET", weight: 10 },
    { path: "/very-slow", method: "GET", weight: 15 },
    // 4xx errors
    { path: "/not-found", method: "GET", weight: 8 },
    { path: "/unauthorized", method: "GET", weight: 5 },
    { path: "/forbidden", method: "GET", weight: 4 },
    { path: "/bad-request", method: "GET", weight: 3 },
    // 5xx errors
    { path: "/server-error", method: "GET", weight: 10 },
    { path: "/service-unavailable", method: "GET", weight: 10 },
];
function weightedSelect(items) {
    var totalWeight = items.reduce(function (sum, item) { return sum + item.weight; }, 0);
    var random = Math.random() * totalWeight;
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        if (random < item.weight) {
            return item;
        }
        random -= item.weight;
    }
    return items[0];
}
function sendRequest() {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, url, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = weightedSelect(ENDPOINTS);
                    url = "".concat(BASE_URL).concat(endpoint.path);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch(url, {
                            method: endpoint.method,
                            headers: { "Content-Type": "application/json" },
                            body: endpoint.method === "POST" ? JSON.stringify({ name: "Test User", email: "test@example.com" }) : undefined,
                        })];
                case 2:
                    response = _a.sent();
                    console.log("".concat(endpoint.method, " ").concat(endpoint.path, " \u2192 ").concat(response.status));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Request failed: ".concat(endpoint.method, " ").concat(endpoint.path), error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Generating ".concat(TOTAL_REQUESTS, " requests..."));
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < TOTAL_REQUESTS)) return [3 /*break*/, 5];
                    return [4 /*yield*/, sendRequest()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log("Traffic generation complete.");
                    return [2 /*return*/];
            }
        });
    });
}
main();
