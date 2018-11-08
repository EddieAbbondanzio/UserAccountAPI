
/**
 * Error codes that are returned back to the caller
 * of the API.
 */
export enum ServerErrorCode {
    /**
     * An unknown error occured.
     */
    Unknown = 1,
    /**
     * No authentication header was present on
     * the request.
     */
    NoAuthentication = 2,
    /**
     * The authentication headers or token itself
     * of the request were poorly formed.
     */
    PoorlyFormedAuthentication = 3,
    /**
     * The JWT provided with the request was invalid,
     * likely expired or fake.
     */
    InvalidAuthentication = 4,
    /**
     * The body of the request is missing a required
     * parameter.  
     */
    MissingBodyParameter = 5,
    /**
     * The request was bad, something went wrong say
     * an invalid password when registering a user.
     */
    FailedRequest = 6,

}