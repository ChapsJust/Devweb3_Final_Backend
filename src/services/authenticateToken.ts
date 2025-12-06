import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import ENV from '@src/common/constants/ENV';

/**
 * Intergiciel pour authentifier le jeton de l'utilisateur
 */
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const lastPartOfUrl = req.url.split('/').pop();
  if (lastPartOfUrl === 'generatetoken') {
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (token == null) return res.sendStatus(HttpStatusCodes.UNAUTHORIZED);

  jwt.verify(token, ENV.Jwtsecret, (err: jwt.VerifyErrors | null) => {
    if (err) return res.sendStatus(HttpStatusCodes.FORBIDDEN);
    next();
  });
}

export default authenticateToken;
