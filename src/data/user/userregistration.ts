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

    /**
     * Validate the registration to see if everything is 
     * okay. This will check the username, and more.
     * @returns True if the user is accepted.
     */
    public validate(): boolean {
        //Check if the username is valid
        if(!/^[-\w\_]{4,24}$/.test(this.username)) {
            return false;
        }

        //Check the password
        if(StringUtils.isBlank(this.password) || this.password.length < User.MIN_PASSWORD_LENGTH){
            return false;
        }

        //Check the name
        if(StringUtils.isBlank(this.name)) {
            return false;
        }

        //Check the email
        if(StringUtils.isBlank(this.email)){
            return false;
        }

        //Made it this far, it must be good.
        return true;
    }
}