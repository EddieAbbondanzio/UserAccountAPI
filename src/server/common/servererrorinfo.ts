import { Server } from "net";
import { ServerErrorCode } from "./servererrorcode";

/**
 * Information about an error that occured. These are sent
 * back to the client that made the HTTP request.
 */
export class ServerErrorInfo {
    /**
     * The error code.
     */
    public errorCode: ServerErrorCode;

    /**
     * The text based error message.
     */
    public errorMessage: string;

    /**
     * Create a new error info to send back to a client.
     * @param errorCode The error code.
     * @param errorMsg The error message.
     */
    constructor(errorCode: ServerErrorCode, errorMsg?: string) {
        this.errorCode = errorCode;
        this.errorMessage = errorMsg;
    }
}