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
const ExpressJWT = require("express-jwt");
const config_1 = require("../../config/config");
/**
 * Decorator to restrict access to a API endpoint. If no JWT is
 * found on the incoming request then it is rejected.
 * @param target The instance or static class.
 * @param propertyKey The name of the method.
 * @param descriptor The method being decorated.
 */
function authenticated(target, propertyKey, descriptor) {
    let method = descriptor.value;
    //We wrap the existing method so we can call Passport.js first.
    descriptor.value = function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Is the user authenticated, if not this will throw an error.
            ExpressJWT({ secret: config_1.Config.current.tokenSignature });
            //Now call the method if we made it this far.
            method.call(this, req, res);
        });
    };
}
exports.authenticated = authenticated;
//# sourceMappingURL=authenticated.js.map