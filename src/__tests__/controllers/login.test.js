import { login } from '../../controllers/login';
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


describe('login', () => {
    it('Should return 400 if the required fields empty', async () => {
        const req = mockRequest({});
        const res = mockResponse();

        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    })

    it('Should return 404 if the userName does not exist', async () => {
        const req = mockRequest({userName: 'username', password: 'password'});
        const res = mockResponse();

        Account.findOne.mockResolvedValueOnce(null);

        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    })

    it('Should return 401 if the password is wrong', async () => {
        const req = mockRequest({userName: 'username', password: 'password'});
        const res = mockResponse();

        const mockAcc = {password: 'hashed_password'};
        Account.findOne.mockReturnValueOnce(mockAcc);
        comparePassword = jest.fn().mockReturnValueOnce(false);

        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    })

    it('Should return 200 when login with correct credential', async () => {
        const req = mockRequest({userName: 'username', password: 'password'});
        const res = mockResponse();

        const mockAcc = {userName: 'username', password: 'password', lastLoginDateTime: Date.now()};
        Account.findOne.mockReturnValueOnce(mockAcc);

        comparePassword = jest.fn().mockReturnValueOnce(true);
        generateToken = jest.fn().mockReturnValueOnce('token_generated');

        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(200);

    })
})