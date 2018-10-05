import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from "../user/user";
import { RandomUtils } from '../../util/randomutils';

/**
 * Token that is sent to a user to reset their password.
 * This is required when they attempt to reset their password,
 * else it is rejected.
 */
@Entity({name: "ResetToken"})
export class ResetToken {
    /**
     * The ideal code length for reset tokens.
     */
    private static CODE_LENGTH: number = 8;

    /**
     * The unique id of the reset token.
     */
    @PrimaryGeneratedColumn()
    public id: number;

    /**
     * The user that this reset token belongs to.
     */
    @JoinColumn()
    @OneToOne(type => User, user => user.stats, {primary: true})
    public user: User;

    /**
     * The unique code that the user must pass back.
     */
    @Column("char", {length: ResetToken.CODE_LENGTH, nullable: false})
    public code: string;

    /**
     * Generate a new password reset token for the passed
     * in user.
     * @param user The user to generate a token for.
     * @returns The newly generated token.
     */
    public static generateToken(user: User): ResetToken {
        let rToken = new ResetToken();
        rToken.user = user;
        rToken.code = RandomUtils.generateRandomString(ResetToken.CODE_LENGTH);

        return rToken;
    }
}