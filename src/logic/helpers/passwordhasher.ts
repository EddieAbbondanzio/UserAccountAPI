import * as BcryptJS from 'bcryptjs';
import { StringUtils } from '../../util/stringutils';

/**
 * Hasher utility for creating new password hashes and
 * validating passed in passwords.
 */
export module PasswordHasher {
    /**
     * Generate a new password hash from a passed in hash.
     * @param password The password to hash
     */
    export async function generateHash(password: string):Promise<string> {
        if(StringUtils.isBlank(password)){
            throw new Error('No password, or blank password passed in!');
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
    export async function validateHash(password: string, hash: string):Promise<boolean>{
        if(typeof password !== 'string' || typeof hash !== 'string'){
            throw new Error('Bad password, or hashed passed in!');
        }
        
        return await BcryptJS.compare(password, hash);
    }
}