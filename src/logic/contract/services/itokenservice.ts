import { TokenService } from "../../services/tokenservice";

/**
 * Token service for issuing JWTs.
 */
export interface ITokenService<T extends object> extends TokenService<T> { }