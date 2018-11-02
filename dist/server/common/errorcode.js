"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Error codes that are returned back to the caller
 * of the API.
 */
var ErrorCode;
(function (ErrorCode) {
    /**
     * No authentication header was present on
     * the request.
     */
    ErrorCode[ErrorCode["NoAuthentication"] = 1] = "NoAuthentication";
    /**
     * The authentication headers or token itself
     * of the request were poorly formed.
     */
    ErrorCode[ErrorCode["PoorlyFormedAuthentication"] = 2] = "PoorlyFormedAuthentication";
    /**
     * The JWT provided with the request was invalid,
     * likely expired or fake.
     */
    ErrorCode[ErrorCode["InvalidAuthentication"] = 3] = "InvalidAuthentication";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
//# sourceMappingURL=errorcode.js.map