"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusCode = require("http-status-codes");
const servererrorinfo_1 = require("../servererrorinfo");
const servererrorcode_1 = require("../servererrorcode");
/**
 * Decorator to require a specific format for the body of the
 * incoming request. If the body is incorrectly formatted, then
 * a HTTP status of 400 is returned.
 * @param constructor The constructor of the object expected to
 * be in the body.
 * @param options The options to use.
 */
function body(constructor, options) {
    return function (target, propertyKey, descriptor) {
        let instance = new constructor();
        let method = descriptor.value;
        descriptor.value = function (req, res) {
            let isBodyValid = true;
            //Is the body structurally identical to our type? TODO: Make this recursive.
            for (var prop in instance) {
                if (!req.body.hasOwnProperty(prop)) {
                    isBodyValid = false;
                    break;
                }
            }
            //Do we need to reject it?
            if (!isBodyValid && (options == null || (options != null && !options.optional))) {
                res.status(HttpStatusCode.BAD_REQUEST)
                    .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.MissingBodyParameter, 'Request body is missing property: ' + prop));
                return;
            }
            //Pull the ole switcheroo
            Object.assign(instance, req.body);
            req.body = instance;
            method.call(this, req, res);
        };
    };
}
exports.body = body;
//# sourceMappingURL=body.js.map