import { prisma } from "../config/database"

export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } })

export const createUser = (data: {
  email: string
  passwordHash: string
  name?: string
}) =>
  prisma.user.create({ data })
