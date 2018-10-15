import * as BcryptJS from 'bcryptjs';

/**
 * Hasher utility for creating new password hashes and
 * validating passed in passwords.
 */
export class PasswordHasher {
    /**
     * Generate a new password hash from a passed in hash.
     * @param password The password to hash
     */
    public static async generateHash(password: string):Promise<string> {
        //Don't hash an empty or null password.
        if(typeof password !== 'string'){
            return null;
        }

        //The # is saltRounds. Currently 10 is default.
        return await BcryptJS.hash(password, 10);
    }

    /**
     * Hashes a passed in password and compares it against the 
     * known password hash
     * @param password The password to hash and check.
     * @param hash The hash to compare against.
     */
    public static async validateHash(password: string, hash: string):Promise<boolean>{
        if(typeof password !== 'string' || typeof hash !== 'string'){
            return false;
        }
        
        return await BcryptJS.compare(password, hash);
    }
}