import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from "../user/user";
import { RandomUtils } from '../../util/randomutils';

/**
 * Token that is sent to a user to validate their
 * email address. User's aren't considered active 
 * unless they have a valid email.
 */
@Entity({ name: "ValidationToken"})
export class ValidationToken {
    /**
     * The ideal code length for validation tokens.
     */
    private static CODE_LENGTH: number = 4;

    /**
     * The unique id of the validation token.
     */
    @PrimaryGeneratedColumn("increment", {type: "bigint", unsigned: true})
    public id: number;

    /**
     * The user that this validation token belongs to.
     */
    @JoinColumn()
    @OneToOne(type => User, user => user.stats, {primary: true})
    public user: User;

    /**
     * The unique code that the user must pass back.
     */
    @Column("char", {length: ValidationToken.CODE_LENGTH, nullable: false})
    public code: string;

    /**
     * Generate a new validation token.
     * @param user The user to generate a token for.
     * @returns The newly generated token.
     */
    public static generateToken(user: User): ValidationToken {
        let vToken = new ValidationToken();
        vToken.user = user;
        vToken.code = RandomUtils.generateRandomString(ValidationToken.CODE_LENGTH);

        return vToken;
    }
}