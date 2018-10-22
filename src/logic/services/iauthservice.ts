import { User } from "../models/user";
import { UserRegistration } from "../common/userregistration";

/**
 * The service for user authentication.
 */
export interface IAuthService {
    /**
     * User forgot their username and wants it emailed to them.
     * @param email The user's email to send it to.
     */
    emailUserTheirUsername(email: string): Promise<void>;

    /**
     * User forgot their email and wants a temporary access password
     * emailed to them. This will not remove their existing password.
     * @param username The username of the user to email.
     */
    emailUserResetToken(username: string): Promise<void>;
    
    /**
     * Login a user via their credentials.
     * @param username The user's username.
     * @param password The user's password.
     * @returns The user if successful. Otherwise null.
     */
    loginUserViaCredentials(username: string, password: string): Promise<User>;

        /**
     * Login a user using a JWT they have.
     * @param token The JWT from a previous login.
     * @returns The user if successful. Otherwise null.
     */
    loginUserViaToken(token: string): Promise<User>;

    /**
     * Log out a user that is currently logged in.
     * @param user The username to log out.
     * @returns True if logged out.
     */
    logoutUser(user: User): Promise<boolean>;

    /**
     * Reset a user's password after verifying their token is valid.
     * @param user The user.
     * @param resetCode Their temporary access password.
     * @param newPassword Their new desired password.
     * @returns True if the token was valid.
     */
    resetPassword(user: User, resetCode: string, newPassword: string): Promise<boolean>

    /**
     * Update a user's password. This only proceeds if their current
     * password passed in is valid.
     * @param user The user to update.
     * @param currPassword Their current password.
     * @param newPassword Their new desired password.
     * @returns True if successful.
     */
    updatePassword(user: User, currPassword: string, newPassword: string): Promise<boolean>

    /**
     * Register a new user with the system. This will
     * send them a confirmation email before they are done.
     * @param registration The user's info.
     * @returns The new user, or null if it failed.
     */
    registerNewUser(registration: UserRegistration): Promise<User>;

    /**
     * Verify a user's email by checking the validation code they gave us.
     * @param user The user whos email we need to validate.
     * @param verificationCode The validation code they provided.
     * @returns True if the code was valid.
     */
    verifyUserEmail(user: User, verificationCode: string): Promise<boolean>;

    /**
     * The user didn't recieve their validation code. Resend them an
     * email with it again.
     * @param user The user to re email.
     * @returns True if no error.
     */
    resendVerificationEmail(user: User): Promise<boolean>;

    /**
     * Validate that a user is who they claim to be. This will check their username
     * against the login provided in the database.
     * @param user The user to validate.
     * @param loginCode Their login guid.
     * @returns True if the user is who they claim to be.
     */
    validateUser(user: User, loginCode: string): Promise<boolean>;
}