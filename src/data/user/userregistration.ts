import { StringUtils } from "../../util/stringutils";
import { User } from "./user";

/**
 * Information of a user that wants to register with
 * the system.
 */
export class UserRegistration {
    /**
     * The username that the user wants
     * to use.
     */
    public username: string;

    /**
     * The password they want to use to 
     * login with.
     */
    public password: string;

    /**
     * Their real name. Or a fake, who knows.
     */
    public name: string;

    /**
     * The email to use to send a confirmation 
     * to, or to send emails when they forget
     * their password.
     */
    public email: string;
}