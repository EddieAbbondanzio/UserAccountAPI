import * as BcryptJS from 'bcryptjs';
import { StringUtils } from '../../util/stringutils';
import { ArgumentError } from '../../common/errors/argumenterror';
import { NullArgumentError } from '../../common/errors/nullargumenterror';

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
        if(password == null){
            throw new NullArgumentError('password');
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
        if(password == null){
            throw new NullArgumentError('password');
        }
        else if(hash == null){
            throw new NullArgumentError('hash');
        }
        
        return await BcryptJS.compare(password, hash);
    }
}