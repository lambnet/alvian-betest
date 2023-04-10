import * as accountController from '../../controllers/account.js';
import Account from '../../models/account.js';

const mockRequest = (body) =>  ({
    body,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

jest.mock('../../models/account.js');

describe('createAccount', () => {
    it('Should return status 400 if the required fields empty', async () => {
        const req = mockRequest({});
        const res = mockResponse();

        await accountController.createAccount(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    })

    it('Should return status 401 if userName already registered', async () => {
        const req = mockRequest({userName: 'username', password: 'password', userId: 'id-user'});
        const res = mockResponse();

        Account.findOne.mockImplementationOnce(() => ({
            id: 1,
            userName: 'username',
            password: 'pass'
        }));

        await accountController.createAccount(req,res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('Should return status 201 when account created', async () => {
        const req = mockRequest({userName: 'username', password: 'password', userId: 'id-user'});
        const res = mockResponse();

        Account.findOne.mockResolvedValueOnce(null);
        
        await accountController.createAccount(req,res);
        expect(res.status).toHaveBeenCalledWith(201);        
    })


})