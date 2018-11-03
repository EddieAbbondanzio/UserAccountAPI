import { ITokenService } from "../../../../logic/contract/services/itokenservice";
import { TokenService } from "../../../../logic/services/tokenservice";
import { expect } from 'chai';
import 'mocha';
import * as chaiAsPromised from 'chai-as-promised';
import { NullArgumentError } from "../../../../common/error/types/nullargumenterror";
import * as chai from 'chai'

/**
 * Mock payload object for storing the test JWTs.
 */
class MockPayload {
    public foo: string;

    constructor(foo: string) {
        this.foo = foo;
    }
}

class MockPayload2 {
    public bar: string;

    constructor(bar: string) {
        this.bar = bar;
    }
}

/**
 * Test module for testing the Token Service.
 */
describe('TokenService', () => {
    let tokenService: ITokenService<MockPayload>;

    before(() => {
        chai.use(chaiAsPromised);
        tokenService = new TokenService<MockPayload>('secret');
    });

    describe('constructor()', () => {
        it('throws an error if no signature', () => {
            expect(() => { new TokenService<MockPayload>(null); })
            .to.throw(NullArgumentError);
        });
    });

    describe('issueToken()', () => {
        it('throws an error if no payload', async () => {
            await expect(tokenService.issueToken(undefined))
            .to.be.rejectedWith(NullArgumentError);
        });

        it('issues a JWT for a valid payload', async () => {
            let payload: MockPayload = new MockPayload('cat');

            await expect(tokenService.issueToken(payload))
            .to.be.eventually.fulfilled.with.a('String');
        });
    });

    describe('authenticateToken()', () => {
        it('throws an error if no token', async () => {
            await expect(tokenService.authenticateToken(null, MockPayload))
            .to.eventually.be.rejectedWith(NullArgumentError);
        });

        it('returns a payload from a valid token', async () => {
            let payload: MockPayload = new MockPayload('cat');
            let jwt: string = await tokenService.issueToken(payload);

            await expect(tokenService.authenticateToken(jwt, MockPayload))
            .to.eventually.be.fulfilled.and.deep.equal(payload);
        });

        it('throws an error if incorrect payload', async () => {
            let payload: MockPayload = new MockPayload('cat');
            let jwt: string = await tokenService.issueToken(payload);

            await expect(tokenService.authenticateToken(jwt, MockPayload2))
            .to.eventually.be.rejectedWith(TypeError);
        });
    });
});