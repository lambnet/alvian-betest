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
    
    it('Should return 500 when an error occur', async () => {
        const req = mockRequest({userName: 'username', password: 'password'});
        const res = mockResponse();

        const mockErr = new Error('mock error');
        Account.findOne.mockRejectedValue(mockErr);
        
        await accountController.createAccount(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    })
})

describe('getAllAccount', () => {
    it('Should return 200 when accounts available', async () => {
        const req = mockRequest({});
        const res = mockResponse();

        const mockAccs = [
            {
                accountId: "8539ab95-234b-48c9-ae7d-85cc6abd5c36",
                userName: "admin",
                lastLoginDateTime: "2023-04-10T02:01:32.524Z",
                userId: "6caa8fa0-5354-4ecf-af4d-a2310a619134"
            },
            {
                accountId: "a8efb7f9-9616-42be-b390-63f8aec07c98",
                userName: "alvian",
                lastLoginDateTime: "2023-04-06T08:41:32.941Z",
                userId: "d39f1dbe-168e-4538-aadb-f2dce5572c63"
            },
            {
                accountId: "8a9a8a6a-c2a6-4c69-b87c-7034eb4d6a21",
                userName: "minggu",
                lastLoginDateTime: "2023-04-09T09:37:23.429Z",
                userId: "edaf640e-5e6e-4ec0-9f8b-e0c596cd77ca"
            },
        ];

        Account.find.mockResolvedValueOnce(mockAccs);

        await accountController.getAllAccount(req, res);
        
        expect(Account.find).toHaveBeenCalledWith({}, expect.any(Object));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ accounts: mockAccs });
    })

    it('Should return 500 when an error occur', async () => {
        const req = mockRequest({userName: 'username', password: 'password'});
        const res = mockResponse();

        const mockErr = new Error('mock error');
        Account.find.mockRejectedValue(mockErr);
        
        await accountController.getAllAccount(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    })
})

describe('getAllAccByLastLogin', () => {
    it('should return a list of accounts that have not logged in within the specified number of days', async () => {
        const req = {params: {days: '20'}};
        const res = mockResponse();

        const mockAccounts = [
        {
            _id: '1234567890',
            userName: 'testuser1',
            lastLoginDateTime: new Date('2022-03-01T00:00:00.000Z')
        },
        {
            _id: '0987654321',
            userName: 'testuser2',
            lastLoginDateTime: new Date('2022-03-10T00:00:00.000Z')
        },
        {
            _id: '2468013579',
            userName: 'testuser3',
            lastLoginDateTime: new Date('2022-04-01T00:00:00.000Z')
        }
        ];

        Account.find = jest.fn().mockResolvedValue(mockAccounts);

        await accountController.getAllAccByLastLogin(req, res);

        expect(Account.find).toHaveBeenCalledWith(
        { lastLoginDateTime: { $lt: expect.any(Date) } },
        expect.any(Object)
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ accounts: mockAccounts });
    });
})

describe('deleteAccByAccId', () => {
    it('Should return 400 when accountId is not presented', async () => {
        const req = {params: {}};
        const res = mockResponse();

        await accountController.deleteAccByAccId(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({msg: 'accountId is required'});
    })

    it('Should return 404 when accountId is not found', async () => {
        const req = {params: {accountId: '1714'}};
        const res = mockResponse();

        Account.deleteOne.mockResolvedValueOnce(null);

        await accountController.deleteAccByAccId(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({msg: `Account with accountId: ${req.params.accountId} not found`});
    })

    it('Should return 200 when account successfully deleted', async () => {
        const req = {params: {accountId: '7132'}};
        const res = mockResponse();

        Account.deleteOne.mockResolvedValueOnce({accountId:'7132'});

        await accountController.deleteAccByAccId(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
    })
})

describe('updateAccPasswordByAccId', () => {
    it('should return 404 when accountId not found', async () => {
        const req = {params: {accountId: '312'}, body: {password: 'new_password'}};
        const res = mockResponse();
        Account.updateOne.mockResolvedValueOnce(null);

        await accountController.updateAccPasswordByAccId(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    })

    it('should return 400 when param is not presented', async () => {
        const req = {params: {}, body: {password: 'new_password'}};
        const res = mockResponse();
        Account.updateOne.mockResolvedValueOnce(null);

        await accountController.updateAccPasswordByAccId(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({msg: 'make sure to provide accountId or password'})
    })

    it('should return 200 when successfully updated', async () => {
        const req = {params: {accountId: '7412'}, body: {password: 'new_password'}};
        const res = mockResponse();

        const mockUpdated = {password:'new_password'};
        Account.updateOne.mockResolvedValueOnce(mockUpdated);

        await accountController.updateAccPasswordByAccId(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({updatedAcc: mockUpdated})
    })
})