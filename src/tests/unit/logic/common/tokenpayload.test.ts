import { expect } from 'chai';
import 'mocha';
import { TokenPayload } from '../../../../logic/common/tokenpayload';

describe('TokenPayload', () => {
    describe('constructor()', () => {
        let tokenPL: TokenPayload;

        it('userId is defined.', () => {
            let tokenPL = new TokenPayload(100);
            expect(tokenPL.userId).to.equal(100);
        });

        it('userId is undefined.', () => {
            let tokenPL = new TokenPayload();
            expect(tokenPL.userId).to.be.undefined;
        });
    });
});