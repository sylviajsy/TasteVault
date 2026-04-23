const MOCK_USER_ID = 'c93caa23-6ccc-4ee9-8e2e-1dafc8e3caba';

export const authMiddleware = (req, res, next) => {
  // Mock user
  req.user = {
    id: MOCK_USER_ID,
    email: 'siyi@example.com'
  };
  next();
};

export default authMiddleware;
