import type { Prisma, User, UserProfile } from "@prisma/client";
import { prisma } from "../database/prisma.js";

export const createUser = (data: Prisma.UserCreateInput): Promise<User> => {
  return prisma.user.create({ data });
};

export const findUserById = (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

export const findUserByEmail = (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

export const updateUserById = (id: string, data: Prisma.UserUpdateInput): Promise<User> => {
  return prisma.user.update({ where: { id }, data });
};

export const deleteUserById = (id: string): Promise<User> => {
  return prisma.user.delete({ where: { id } });
};

export const findProfileByUserId = (userId: string): Promise<UserProfile | null> => {
  return prisma.userProfile.findUnique({ where: { userId } });
};

export const createProfile = (data: Prisma.UserProfileUncheckedCreateInput): Promise<UserProfile> => {
  return prisma.userProfile.create({ data });
};

export const updateProfileByUserId = (
  userId: string,
  data: Prisma.UserProfileUpdateInput
): Promise<UserProfile> => {
  return prisma.userProfile.update({ where: { userId }, data });
};
