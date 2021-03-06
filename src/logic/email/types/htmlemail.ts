import { IEmail } from "./iemail";
import { EmailOptions } from "../emailoptions";

/**
 * An html body email.
 */
export class HtmlEmail implements IEmail {
    /**
     * Who the email is being sent from.
     */
    public sender: string;

    /**
     * Who the email will be sent to. This
     * should be their email address.
     */
    public reciever: string;

    /**
     * The subject line of the email.
     */
    public subject: string;

    /**
     * The actual body of the email.
     */
    public body: string;
    
    /**
     * Create a new email.
     * @param reciever The reciever's email address.
     * @param subject The subject line of the email.
     * @param body The body of the email.
     */
    constructor(reciever?: string, subject?: string, body?: string) {
        this.reciever = reciever;
        this.subject  = subject;
        this.body     = body;
    }

    /**
     * Get the options for sending out the email.
     */
    public getSendOptions():EmailOptions {
        return new EmailOptions(this.reciever, this.sender, this.subject, this.body, true);
    }
}