import { expect } from 'chai';
import 'mocha';
import { AuthenticationError } from '../../../../common/error/types/authenticationerror';

describe('AuthenticationError', () => {
    describe('constructor()', () => {
        let error: AuthenticationError = new AuthenticationError('message');

        it('message is defined.', () => {
            expect(error.message).to.equal('message');
        });
    });
});