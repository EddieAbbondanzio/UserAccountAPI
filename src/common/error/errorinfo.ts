
/**
 * Information about an error that occured. These are sent
 * back to the client that made the HTTP request.
 */
export class ErrorInfo {
    /**
     * The error code.
     */
    public errorCode: number;

    /**
     * The text based error message.
     */
    public errorMessage: string;

    /**
     * Create a new error info to send back to a client.
     * @param errorCode The error code.
     * @param errorMsg The error message.
     */
    constructor(errorCode: number, errorMsg: string) {
        this.errorCode = errorCode;
        this.errorMessage = errorMsg;
    }
}