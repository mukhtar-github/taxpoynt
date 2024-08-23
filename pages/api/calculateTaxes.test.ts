import { createMocks } from 'node-mocks-http';
import handler from './calculateTaxes';
import { getMonoTransactions } from '@/lib/actions/transaction.actions';
import { calculateIncomeTax, calculateVAT } from '@/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';

jest.mock('@/lib/actions/transaction.actions');
jest.mock('@/lib/utils');

describe('/api/calculateTaxes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return 400 if accountId is missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ error: 'accountId is required' });
  });

  it('should return 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Method Not Allowed' });
  });

  it('should calculate taxes correctly', async () => {
    const mockTransactions = [
      { income: 1000, amount: 500 },
      { income: 2000, amount: 1000 },
    ];
    (getMonoTransactions as jest.Mock).mockResolvedValue({
      forEach: (callback: (transaction: { income: number; amount: number }) => void) => {
        mockTransactions.forEach(callback);
      },
    });
    (calculateVAT as jest.Mock).mockReturnValue(112.5);
    (calculateIncomeTax as jest.Mock).mockReturnValue(450);

    const { req, res } = createMocks({
      method: 'POST',
      body: { accountId: 'test-account-id', realTime: false },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ vat: 112.5, incomeTax: 450 });
    expect(getMonoTransactions).toHaveBeenCalledWith('test-account-id', 1, false);
    expect(calculateVAT).toHaveBeenCalledWith(1500);
    expect(calculateIncomeTax).toHaveBeenCalledWith(3000);
  });

  it('should handle errors when fetching transactions', async () => {
    (getMonoTransactions as jest.Mock).mockRejectedValue(new Error('Failed to fetch transactions'));

    const { req, res } = createMocks({
      method: 'POST',
      body: { accountId: 'test-account-id', realTime: false },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Failed to fetch transactions or calculate taxes' });
  });
});