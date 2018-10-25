"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Easy way to determine error codes from MySQL. Source:
 * https://dev.mysql.com/doc/refman/5.5/en/error-messages-server.html
 */
var MySqlErrorCode;
(function (MySqlErrorCode) {
    MySqlErrorCode[MySqlErrorCode["DuplicateKey"] = 1062] = "DuplicateKey";
})(MySqlErrorCode = exports.MySqlErrorCode || (exports.MySqlErrorCode = {}));
//# sourceMappingURL=mysqlerror.js.map