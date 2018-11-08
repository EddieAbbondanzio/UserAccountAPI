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
const servererrorcode_1 = require("../servererrorcode");
const invalidoperation_1 = require("../../../common/error/types/invalidoperation");
const errorhandler_1 = require("../../../common/error/errorhandler");
const authenticationerror_1 = require("../../../common/error/types/authenticationerror");
const expressutils_1 = require("../../../util/expressutils");
const ioccontainer_1 = require("../../ioccontainer");
const ioctypes_1 = require("../../../common/ioc/ioctypes");
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
                let bearerToken = expressutils_1.ExpressUtils.getBearerToken(req);
                //Is there any headers?
                if (bearerToken == null) {
                    sendUnauthorizedResponse(res, servererrorcode_1.ServerErrorCode.NoAuthentication, 'No authentication token.');
                    return;
                }
                //Is the token even valid?
                try {
                    let tokenService = ioccontainer_1.IocContainer.instance.get(ioctypes_1.IOC_TYPES.TokenService);
                    if (tokenService == null) {
                        throw new invalidoperation_1.InvalidOperationError('Cannot authenticate a user with no token service');
                    }
                    //Is the token valid?
                    let accessToken = yield tokenService.authenticateToken(bearerToken);
                    //Catch will take over if the payload was bad.
                    let user = yield ioccontainer_1.IocContainer.instance.get(ioctypes_1.IOC_TYPES.UserService).findById(accessToken.userId);
                    //Is there a valid login in the DB for it?
                    let isValidLogin = yield ioccontainer_1.IocContainer.instance.get(ioctypes_1.IOC_TYPES.AuthService).validateLogin(user, accessToken.loginCode);
                    if (!isValidLogin) {
                        res.sendStatus(HttpStatusCode.UNAUTHORIZED);
                    }
                    else {
                        //Attach the user to the request then call the regular method.
                        req.user = user;
                        return method.call(this, req, res);
                    }
                }
                catch (error) {
                    new errorhandler_1.ErrorHandler(error)
                        .catch(authenticationerror_1.AuthenticationError, (error) => {
                        sendUnauthorizedResponse(res, servererrorcode_1.ServerErrorCode.InvalidAuthentication, 'Invalid authentication token.');
                    })
                        .otherwiseRaise();
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