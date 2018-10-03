"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A standard email object.
 */
class Email {
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
}
exports.Email = Email;

//# sourceMappingURL=email.js.map
