import { Prisma } from '@prisma/client'
import prisma from './client.db'

export const getBooks = (userId: number) =>
  prisma.book
    .findMany({
      include: {
        author: true,
        quotes: {
          orderBy: {
            createdAt: 'asc',
          },
          where: {
            userId,
          },
        },
      },
      orderBy: {
        quotes: {
          _count: 'desc',
        },
      },
    })
    .then(books => books.filter(book => book.quotes.length > 0))

export const saveBook = async (book: Prisma.BookUncheckedCreateInput) => {
  const { id, ...data } = book
  const { update, create } = prisma.book
  return id ? update({ where: { id }, data }) : create({ data })
}

export type Books = Awaited<ReturnType<typeof getBooks>>
