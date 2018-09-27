
/**
 * The information stored in a user JWT.
 */
export class TokenPayload {
    /**
     * The unique user id of the user that owns
     * this JWT.
     */
    public userId: number;
    
    /**
     * Create a new instance of the jWT payload.
     * @param userId The user id of the owner of the JWT.
     */
    constructor(userId?: number) {
        this.userId = userId;
    }
}