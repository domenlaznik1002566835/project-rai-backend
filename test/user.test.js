const chai = require('chai');
const expect = chai.expect;
const ClientController = require('../controllers/clientController');

describe('ClientController', function() {
    it('getByEmail should return a user with the correct firstName', async function() {
        const user = await ClientController.getByEmail("email@gmail.com");

        expect(user).to.have.property('firstName', "firstname");
    });
});