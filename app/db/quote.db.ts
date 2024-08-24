import { Prisma } from '@prisma/client'
import _ from 'lodash'
import prisma from './client.db'

export const getQuotes = async (userId: number) =>
  prisma.quote.findMany({
    where: {
      userId,
      deleted: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

export const saveQuote = async (quote: Prisma.QuoteUncheckedCreateInput) => {
  const { id, ...data } = quote
  const { update, create } = prisma.quote
  return id ? update({ where: { id }, data }) : create({ data })
}

export const toggleDeleted = async (quoteId: number) => {
  const quote = await getQuoteById(quoteId)
  if (!quote) throw new Error('Quote not found')

  return saveQuote({ ...quote, deleted: !quote.deleted })
}

export const getFavorites = (userId: number) =>
  prisma.userFavorite
    .findMany({
      select: {
        quoteId: true,
      },
      where: {
        userId,
      },
    })
    .then(favorites => _.map(favorites, 'quoteId'))

export const toggleFavorite = async (userId: number, quoteId: number) => {
  const favorite = await prisma.userFavorite.findUnique({
    where: { userId_quoteId: { userId, quoteId } },
  })
  const removeFavorite = () =>
    prisma.userFavorite.delete({
      where: { userId_quoteId: { userId, quoteId } },
    })
  const addFavorite = () =>
    prisma.userFavorite.create({
      data: { userId, quoteId },
    })

  return (favorite ? removeFavorite : addFavorite)()
}

export const getQuoteById = (quoteId: number) => prisma.quote.findUnique({ where: { id: quoteId } })
