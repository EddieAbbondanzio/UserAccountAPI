import { AccessTokenService } from "../../../../logic/services/tokenservice";
import { expect } from 'chai';
import 'mocha';
import * as chaiAsPromised from 'chai-as-promised';
import { NullArgumentError } from "../../../../common/error/types/nullargumenterror";
import * as chai from 'chai'
import { IAccessTokenService } from "../../../../logic/contract/services/iaccesstokenservice";
import { UserLogin } from "../../../../logic/models/userlogin";
import { AccessToken } from "../../../../logic/common/accesstoken";

// /**
//  * Test module for testing the Token Service.
//  */
// describe('TokenService', () => {
//     let tokenService: IAccessTokenService;

//     before(() => {
//         chai.use(chaiAsPromised);
//         tokenService = new AccessTokenService('secret');
//     });

//     describe('constructor()', () => {
//         it('throws an error if no signature', () => {
//             expect(() => { new AccessTokenService(null); })
//             .to.throw(NullArgumentError);
//         });
//     });

//     describe('issueToken()', () => {
//         it('throws an error if no payload', async () => {
//             await expect(tokenService.issueToken(undefined))
//             .to.be.rejectedWith(NullArgumentError);
//         });

//         it('issues a JWT for a valid payload', async () => {
//             let payload: MockPayload = new MockPayload('cat');

//             await expect(tokenService.issueToken(payload))
//             .to.be.eventually.fulfilled.with.a('String');
//         });
//     });

//     describe('authenticateToken()', () => {
//         it('throws an error if no token', async () => {
//             await expect(tokenService.authenticateToken(null))
//             .to.eventually.be.rejectedWith(NullArgumentError);
//         });

//         it('returns a payload from a valid token', async () => {
//             let payload: UserLogin = new UserLogin();
//             let accessToken: AccessToken = await tokenService.issueToken(payload);

//             await expect(tokenService.authenticateToken(jwt))
//             .to.eventually.be.fulfilled.and.deep.equal(payload);
//         });

//         it('throws an error if incorrect payload', async () => {
//             let payload: MockPayload = new MockPayload('cat');
//             let jwt: string = await tokenService.issueToken(payload);

//             await expect(tokenService.authenticateToken(jwt, MockPayload2))
//             .to.eventually.be.rejectedWith(TypeError);
//         });
//     });
// });