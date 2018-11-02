"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Information about an error that occured. These are sent
 * back to the client that made the HTTP request.
 */
class ServerErrorInfo {
    /**
     * Create a new error info to send back to a client.
     * @param errorCode The error code.
     * @param errorMsg The error message.
     */
    constructor(errorCode, errorMsg) {
        this.errorCode = errorCode;
        this.errorMessage = errorMsg;
    }
}
exports.ServerErrorInfo = ServerErrorInfo;
//# sourceMappingURL=errorinfo.js.map