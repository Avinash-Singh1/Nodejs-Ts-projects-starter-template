// src/config/index.ts
import dotenv from 'dotenv';
dotenv.config();

export const AUTHKEY_IO = process.env.AUTHKEY_IO || '';
export const AUTHKEY_URL = process.env.AUTHKEY_URL || 'https://sms-provider.example/send';
export const OTHER_CONFIG = process.env.OTHER_CONFIG || '';

export const config = {
  AUTHKEY_IO,
  AUTHKEY_URL,
  OTHER_CONFIG,
};

export default config;
