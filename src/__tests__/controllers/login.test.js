import { login } from '../../controllers/login.js';
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

let comparePassword = jest.fn((x) => x); 

describe('login', () => {
    it('Should return 400 when required fields empty', async () => {
        const req = mockRequest({});
        const res = mockResponse();

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    })

    it('Should return 404 when userName does not exist', async () => {
        const req = mockRequest({userName: 'username', password: 'password'});
        const res = mockResponse();

        Account.findOne.mockResolvedValueOnce(null);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    })

    it('Should return 401 when password is wrong', async () => {
        const req = mockRequest({userName: 'username', password: 'password'});
        const res = mockResponse();

        const mockAcc = {password: 'hashed_password'};
        Account.findOne.mockReturnValueOnce(mockAcc);
        
        comparePassword(false);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
    })

    it('Should return 200 when login with correct credential', async () => {
        const req = mockRequest({userName: 'usertest', password: 'password'});
        const res = mockResponse();

        const mockAcc = {_id: '123' ,userName: 'usertest', password: 'password', lastLoginDateTime: Date.now()};
        Account.findOne.mockResolvedValueOnce(mockAcc);

        comparePassword(true)
        generateToken = jest.fn().mockReturnValueOnce('generated_token');

        await login(req, res);

        expect(Account.findOne).toHaveBeenCalledWith({userName: req.body.userName});
        expect(res.status).toHaveBeenCalledWith(200);

    })

    it('Should return 500 when an error occur', async () => {
        const req = mockRequest({userName: 'username', password: 'password'});
        const res = mockResponse();

        const mockErr = new Error('mock error');
        Account.findOne.mockRejectedValue(mockErr);
        
        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    })
})