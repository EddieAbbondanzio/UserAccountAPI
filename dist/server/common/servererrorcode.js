"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Error codes that are returned back to the caller
 * of the API.
 */
var ServerErrorCode;
(function (ServerErrorCode) {
    /**
     * An unknown error occured.
     */
    ServerErrorCode[ServerErrorCode["Unknown"] = 1] = "Unknown";
    /**
     * No authentication header was present on
     * the request.
     */
    ServerErrorCode[ServerErrorCode["NoAuthentication"] = 2] = "NoAuthentication";
    /**
     * The authentication headers or token itself
     * of the request were poorly formed.
     */
    ServerErrorCode[ServerErrorCode["PoorlyFormedAuthentication"] = 3] = "PoorlyFormedAuthentication";
    /**
     * The JWT provided with the request was invalid,
     * likely expired or fake.
     */
    ServerErrorCode[ServerErrorCode["InvalidAuthentication"] = 4] = "InvalidAuthentication";
    /**
     * The body of the request is missing a required
     * parameter.
     */
    ServerErrorCode[ServerErrorCode["MissingBodyParameter"] = 5] = "MissingBodyParameter";
    /**
     * The request was bad, something went wrong say
     * an invalid password when registering a user.
     */
    ServerErrorCode[ServerErrorCode["FailedRequest"] = 6] = "FailedRequest";
})(ServerErrorCode = exports.ServerErrorCode || (exports.ServerErrorCode = {}));
//# sourceMappingURL=servererrorcode.js.map