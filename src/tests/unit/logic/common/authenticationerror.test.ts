import { expect } from 'chai';
import 'mocha';
import { AuthenticationError } from '../../../../logic/common/authenticationerror';

describe('AuthenticationError', () => {
    describe('constructor()', () => {
        let error: AuthenticationError = new AuthenticationError('message');

        it('message is defined.', () => {
            expect(error.message).to.equal('message');
        });
    });
});