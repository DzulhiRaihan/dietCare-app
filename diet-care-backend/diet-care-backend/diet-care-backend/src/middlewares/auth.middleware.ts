// middlewares/auth.middleware.ts
import jwt from "jsonwebtoken"

// Declare module for jsonwebtoken
declare module 'jsonwebtoken';

export const authMiddleware = (req:any, res:any, next:any) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.sendStatus(401)

  req.user = jwt.verify(token, process.env.JWT_SECRET!)
  next()
}
