
/**
 * Data of a user that wants to update their
 * information.
 */
export class UserUpdate {
    /**
     * This is their actual name.
     */
    public name: string;

    /**
     * Their account email address.
     */
    public email: string;

    /**
     * Create a new user update.
     * @param name The name of the user.
     * @param email The email of the user.
     */
    constructor(name?: string, email?: string) {
        this.name  = name;
        this.email = email;
    }
}