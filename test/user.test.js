import chai from 'chai';
const expect = chai.expect;
import ClientController from '../controllers/clientController';

describe('ClientController', function() {
    it('getByEmail should return a user with the correct firstName', async function() {
        const user = await ClientController.getByEmail("email@gmail.com");

        expect(user).to.have.property('firstName', "firstname");
    });
});