import { EmailOptions } from "../emailoptions";

/**
 * Interface for emails to derive from.
 */
export interface IEmail {
    /**
     * The sender's email address.
     */
    sender: string;

    /**
     * The reciever's email address.
     */
    reciever: string;

    /**
     * The subject line of the email.
     */
    subject: string;

    /**
     * The body of the email.
     */
    body: string;

    /**
     * Get the set of options NodeMailer needs
     * to send out the email.
     */
    getSendOptions(): EmailOptions;
}