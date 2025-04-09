// jest.setup.js
// Mock environment variables
process.env.INTUIT_API_BASE_URL = 'https://sandbox-quickbooks.api.intuit.com';
process.env.NEXT_PUBLIC_INTUIT_API_BASE_URL = 'https://sandbox-quickbooks.api.intuit.com';
process.env.INTUIT_COMPANY_ID = 'test-company-id';
process.env.QB_ENVIRONMENT = 'sandbox';

// Mock the auth module
jest.mock('@/services/intuit/auth', () => ({
  refreshTokensIfNeeded: jest.fn().mockResolvedValue({
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    x_refresh_token_expires_in: 8726400,
    token_type: 'bearer',
    createdAt: Date.now()
  })
}));

// Mock fetch
global.fetch = jest.fn();

// Helper to set up successful API response
global.mockSuccessResponse = (data) => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValueOnce(data)
  });
};

// Helper to set up error API response
global.mockErrorResponse = (status, statusText, errorData = {}) => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    status,
    statusText,
    json: jest.fn().mockResolvedValueOnce(errorData),
    headers: {
      entries: () => []
    }
  });
};

// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});