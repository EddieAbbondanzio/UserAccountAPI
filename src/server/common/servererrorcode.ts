
/**
 * Error codes that are returned back to the caller
 * of the API.
 */
export enum ServerErrorCode {
    /**
     * No authentication header was present on
     * the request.
     */
    NoAuthentication = 1,
    /**
     * The authentication headers or token itself
     * of the request were poorly formed.
     */
    PoorlyFormedAuthentication = 2,
    /**
     * The JWT provided with the request was invalid,
     * likely expired or fake.
     */
    InvalidAuthentication = 3,
    /**
     * The body of the request is missing a required
     * parameter.  
     */
    MissingBodyParameter = 4,
}