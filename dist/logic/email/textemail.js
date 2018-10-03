"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emailoptions_1 = require("./emailoptions");
/**
 * A standard email object.
 */
class TextEmail {
    /**
     * Create a new email.
     * @param sender The sender's email address.
     * @param reciever The reciever's email address.
     * @param subject The subject line of the email.
     * @param body The body of the email.
     */
    constructor(sender, reciever, subject, body) {
        this.sender = sender;
        this.reciever = reciever;
        this.subject = subject;
        this.body = body;
    }
    /**
     * Get the options for sending out the email.
     */
    getSendOptions() {
        return new emailoptions_1.EmailOptions(this.reciever, this.sender, this.subject, this.body);
    }
}
exports.TextEmail = TextEmail;

//# sourceMappingURL=textemail.js.map
