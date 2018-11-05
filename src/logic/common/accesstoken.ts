import { UserLogin } from "../models/userlogin";
import { NotImplementedError } from "../../common/error/types/notimplementederror";

/**
 * An access token the user is given so they can use the
 * restricted portion of the API.
 */
export class AccessToken {
    /**
     * The id of the user this token belongs to.
     */
    public userId: number;

    /**
     * The unique login id of their login.
     */
    public loginCode: string;

    /**
     * The raw token that the user must always provide
     * to the api.
     */
    public bearerToken: string;

    /**
     * Create a new access token.
     * @param userId The user's unique id.
     * @param loginCode Their login's unique code.
     * @param bearerToken The JWT.
     */
    constructor(userId?: number, loginCode?: string, bearerToken?: string) {
        this.userId = userId;
        this.loginCode = loginCode;
        this.bearerToken = bearerToken;
    }
}