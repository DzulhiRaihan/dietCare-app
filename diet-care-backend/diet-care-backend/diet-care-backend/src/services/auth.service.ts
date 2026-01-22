import bcrypt from "bcrypt"
import * as userRepo from "../repositories/user.repo"

export const register = async (email: string, password: string) => {
  const hash = await bcrypt.hash(password, 10)
  return userRepo.createUser({ email, passwordHash: hash })
}
