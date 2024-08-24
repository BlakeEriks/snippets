import { Book, Prisma } from '@prisma/client'
import _ from 'lodash'
import prisma from './client.db'

export type Clipping = {
  source: string
  meta: string
  content: string
  createdAt: Date
}

export const parseClippings = (clippingsText: string): Clipping[] => {
  const clippings = clippingsText
    .split('==========')
    .map(entry => entry.split(/\r?\n/).filter(data => data.length))

  const parsedClippings: Clipping[] = []
  for (const [source, meta, content] of clippings) {
    const parts: string[] = meta?.split(' | ')
    const inception = parts?.pop()
    const createdAt = inception && new Date(inception.replace('Added on ', ''))
    if (createdAt && content) {
      parsedClippings.push({ source, meta: parts?.join(' | '), content, createdAt })
    }
  }

  return parsedClippings
}

// ex The 7 Habits of Highly Effective People (Covey, Stephen R.)
const parseSourceString = (sourceString: string) => {
  // ['The 7 Habits of Highly Effective People', 'Covey, Stephen R.)']
  const [title, author] = sourceString.split(' (')

  // Covey, Stephen R.
  let authorName = author.replace(')', '')

  if (authorName.includes(', ')) {
    // Stephen R. Covey
    authorName = authorName.split(', ').reverse().join(' ')
  }
  return { title, authorName }
}

const createBookWithAuthor = async (sourceString: string) => {
  const { title, authorName } = parseSourceString(sourceString)
  return prisma.book.create({
    data: {
      source: sourceString,
      title,
      author: {
        connectOrCreate: {
          create: {
            name: authorName,
          },
          where: {
            name: authorName,
          },
        },
      },
    },
  })
}

export const saveClippings = async (clippingsString: string, userId: number) => {
  const clippings = parseClippings(clippingsString)
  const allBooks = await prisma.book.findMany()
  const sourceStrings = new Set(_.map(clippings, 'source') as string[])
  const allQuotesCreatedAts = new Set(
    _.map(await prisma.quote.findMany(), ({ createdAt }) => createdAt.toISOString())
  )

  // Create books from source strings if they don't yet exist
  for (const sourceString of Array.from(sourceStrings)) {
    // Skip if the book source string already exists
    if (allBooks.find(({ source }) => source === sourceString)) continue

    allBooks.push(await createBookWithAuthor(sourceString))
  }

  // Filter out quotes that already exist
  const filteredQuotes = clippings.filter(
    ({ createdAt }) => !allQuotesCreatedAts.has(createdAt.toISOString())
  )

  const createQuotesInput = filteredQuotes.map(
    ({ createdAt, meta, content, source }): Prisma.QuoteCreateManyInput => ({
      createdAt: new Date(createdAt),
      meta,
      content,
      userId,
      bookId: (_.find(allBooks, { source }) as Book).id,
    })
  )

  return prisma.quote.createMany({ data: createQuotesInput })
}
