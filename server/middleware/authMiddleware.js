import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';

// Read .env
dotenv.config();

export const authMiddleware = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  // JWT Token Signing Algorithm
  tokenSigningAlg: 'RS256',
});

export default authMiddleware;
