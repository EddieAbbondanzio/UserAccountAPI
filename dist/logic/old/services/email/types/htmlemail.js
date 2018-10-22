"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emailoptions_1 = require("../emailoptions");
/**
 * An html body email.
 */
class HtmlEmail {
    /**
     * Create a new email.
     * @param reciever The reciever's email address.
     * @param subject The subject line of the email.
     * @param body The body of the email.
     */
    constructor(reciever, subject, body) {
        this.reciever = reciever;
        this.subject = subject;
        this.body = body;
    }
    /**
     * Get the options for sending out the email.
     */
    getSendOptions() {
        return new emailoptions_1.EmailOptions(this.reciever, this.sender, this.subject, this.body, true);
    }
}
exports.HtmlEmail = HtmlEmail;
//# sourceMappingURL=htmlemail.js.map