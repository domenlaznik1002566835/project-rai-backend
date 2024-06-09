const chai = require('chai');
const expect = chai.expect;
const ClientController = require('../controllers/clientController'); // replace with your actual UserController path

describe('UserController', function() {
    it('getUser should return a user with the correct id', async function() {
        const user = await ClientController.getByEmail("email@gmail.com")

        expect(user).to.have.property('firstName', "firstname");
    });
});