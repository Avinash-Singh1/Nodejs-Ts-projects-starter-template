// src/utils/auth.ts
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { config } from '../config/environment';

export const generateHash = async (plain: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(plain, saltRounds);
};

export const compareHash = async (plain: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};

export interface JwtPayloadCustom {
  userId: string;
  userType?: number;
  fullName?: string;
}

/**
 * Generate JWT
 * - payload: small object with userId etc.
 * - expiresIn: optional override, if not provided we use the value from config
 */
export const generateAuthJwt = (
  payload: JwtPayloadCustom,
  expiresIn?: SignOptions['expiresIn']
): string => {
  const tokenPayload = {
    userId: payload.userId,
    userType: payload.userType,
    fullName: payload.fullName,
  };

  // ensure secret is a type acceptable to jsonwebtoken
  const secret: Secret = config.jwtSecret as Secret;

  // prefer passed expiresIn, otherwise fall back to config
  const signOptions: SignOptions = {
    expiresIn: expiresIn ?? (config.jwtExpiresIn as SignOptions['expiresIn']),
  };

  return jwt.sign(tokenPayload as Record<string, unknown>, secret, signOptions);
};

export const verifyAuthJwt = (token: string): JwtPayloadCustom | null => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret as Secret) as jwt.JwtPayload;
    return {
      userId: (decoded as any).userId,
      userType: (decoded as any).userType,
      fullName: (decoded as any).fullName,
    };
  } catch (err) {
    return null;
  }
};

export default {
  generateHash,
  compareHash,
  generateAuthJwt,
  verifyAuthJwt,
};
