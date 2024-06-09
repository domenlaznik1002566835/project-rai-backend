import chai from 'chai';
import getByEmail from '../controllers/clientController.js';

const expect = chai.expect;

describe('ClientController', function() {
    it('getByEmail should return a user with the correct firstName', async function() {
        const user = await getByEmail("email@gmail.com");

        expect(user).to.have.property('firstName', "firstname");
    });
});