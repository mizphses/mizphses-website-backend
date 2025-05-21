import { createId } from '@paralleldrive/cuid2';
import { SignJWT, jwtVerify } from 'jose';

type sessionPayload = {
  uid: string;
  jti: string;
};

export const createToken = async (payload: sessionPayload, secret: string) => {
  const jwt = new SignJWT(payload);
  const signKey = new TextEncoder().encode(secret);

  return jwt
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('https://pager.fuminori.workers.dev')
    .setAudience('https://pager.fuminori.workers.dev')
    .setExpirationTime('2h')
    .sign(signKey);
};

export const createRefreshToken = () => {
  return createId();
};

export const verifyToken = async (token: string, secret: string) => {
  const verifyKey = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(token, verifyKey, {
    algorithms: ['HS256'],
    issuer: 'https://pager.fuminori.workers.dev',
    audience: 'https://pager.fuminori.workers.dev',
  });

  return payload as sessionPayload;
};
