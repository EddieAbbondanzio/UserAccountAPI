"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusCode = require("http-status-codes");
const servererrorinfo_1 = require("../servererrorinfo");
const servicelocator_1 = require("../../../logic/common/servicelocator");
const servicetype_1 = require("../../../logic/common/servicetype");
const servererrorcode_1 = require("../servererrorcode");
/**
 * Decorator to restrict access to a API endpoint. If no JWT is
 * found on the incoming request then it is rejected with a status of 401.
 * @param target The instance or static class.
 * @param propertyKey The name of the method.
 * @param descriptor The method being decorated.
 */
function authenticate() {
    return function (target, propertyKey, descriptor) {
        let method = descriptor.value;
        //We wrap the existing method so we can call express-jwt first.
        descriptor.value = function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                //Is there any headers?
                if (req.headers == null || req.headers.authorization == null) {
                    sendUnauthorizedResponse(res, servererrorcode_1.ServerErrorCode.NoAuthentication, 'No authentication header.');
                    return;
                }
                //Is the header valid?
                let header = req.headers.authorization.split(' ');
                if (header.length != 2) {
                    sendUnauthorizedResponse(res, servererrorcode_1.ServerErrorCode.PoorlyFormedAuthentication, 'Invalid format authentication header.');
                    return;
                }
                //Is the token even valid?
                try {
                    let token = header[1];
                    let payload = yield TokenManager.instance.authenticateToken(token);
                    //Catch will take ovver if the payload was bad.
                    let user = yield servicelocator_1.ServiceLocator.get(servicetype_1.ServiceType.User).findById(payload.userId);
                    //Attach the user to the request then call the regular method.
                    req.user = user;
                    return method.call(this, req, res);
                }
                catch (_a) {
                    sendUnauthorizedResponse(res, servererrorcode_1.ServerErrorCode.InvalidAuthentication, 'Invalid authentication token.');
                    return;
                }
            });
        };
        /**
         * Send a response back with HTTP status 401.
         * @param errorCode The error code (not the HTTP status code) to send.
         * @param errorMessage The message of the error.
         */
        function sendUnauthorizedResponse(res, errorCode, errorMessage) {
            res.status(HttpStatusCode.UNAUTHORIZED)
                .json(new servererrorinfo_1.ServerErrorInfo(errorCode, errorMessage));
        }
    };
}
exports.authenticate = authenticate;
//# sourceMappingURL=authenticate.js.map