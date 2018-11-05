"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nullargumenterror_1 = require("../common/error/types/nullargumenterror");
var ExpressUtils;
(function (ExpressUtils) {
    /**
     * Get the bearer token from the authentication header
     * of the incoming request.
     * @param request The request to extract the bearer
     * token from.
     * @returns The token, or null if none found.
     */
    function getBearerToken(request) {
        if (request == null) {
            throw new nullargumenterror_1.NullArgumentError('request');
        }
        //Any headers?
        if (request.headers == null || request.headers.authorization == null) {
            return null;
        }
        //It always starts with 'Bearer '
        let headerContent = request.headers.authorization.split(' ');
        if (headerContent.length != 2) {
            return null;
        }
        return headerContent[1];
    }
    ExpressUtils.getBearerToken = getBearerToken;
})(ExpressUtils = exports.ExpressUtils || (exports.ExpressUtils = {}));
//# sourceMappingURL=expressutils.js.map