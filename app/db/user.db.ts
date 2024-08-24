import { Prisma } from '@prisma/client'
import prisma from './client.db'

export const getUsers = () => prisma.user.findMany({})

export const createUser = (data: Prisma.UserCreateInput) => prisma.user.create({ data })

export const getUserById = (id: number) => prisma.user.findUnique({ where: { id } })
