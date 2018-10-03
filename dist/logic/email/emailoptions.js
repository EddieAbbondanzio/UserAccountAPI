"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * NodeMailer options for the email transporter.
 */
class EmailOptions {
    /**
     * Create a new set of email options.
     * @param to The reciever's email address.
     * @param from The sender's email address.
     * @param subject The subject line of the email.
     * @param body The body of the email.
     * @param isHtml Is the body html?
     */
    constructor(to, from, subject, body, isHtml) {
        this.to = to;
        this.from = from;
        this.subject = subject;
        if (isHtml) {
            this.html = body;
        }
        else {
            this.text = body;
        }
    }
}
exports.EmailOptions = EmailOptions;

//# sourceMappingURL=emailoptions.js.map
