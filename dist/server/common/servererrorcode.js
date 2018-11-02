"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Error codes that are returned back to the caller
 * of the API.
 */
var ServerErrorCode;
(function (ServerErrorCode) {
    /**
     * No authentication header was present on
     * the request.
     */
    ServerErrorCode[ServerErrorCode["NoAuthentication"] = 1] = "NoAuthentication";
    /**
     * The authentication headers or token itself
     * of the request were poorly formed.
     */
    ServerErrorCode[ServerErrorCode["PoorlyFormedAuthentication"] = 2] = "PoorlyFormedAuthentication";
    /**
     * The JWT provided with the request was invalid,
     * likely expired or fake.
     */
    ServerErrorCode[ServerErrorCode["InvalidAuthentication"] = 3] = "InvalidAuthentication";
    /**
     * The body of the request is missing a required
     * parameter.
     */
    ServerErrorCode[ServerErrorCode["MissingBodyParameter"] = 4] = "MissingBodyParameter";
})(ServerErrorCode = exports.ServerErrorCode || (exports.ServerErrorCode = {}));
//# sourceMappingURL=servererrorcode.js.map