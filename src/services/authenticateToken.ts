import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import ENV from "@src/common/constants/ENV";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, ENV.Jwtsecret) as {
      userId: string;
      email: string;
    };

    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token invalide ou expiré" });
  }
};

export default authenticateToken;
