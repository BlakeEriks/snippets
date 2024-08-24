import { PrismaClient } from '@prisma/client'
import { randomInt } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  // Sample data arrays for randomized content
  const authors = [
    'Alice Munro',
    'James Joyce',
    'Isabel Allende',
    'Kazuo Ishiguro',
    'Margaret Atwood',
  ]
  const titles = [
    'The Shimmering Road',
    'Endless Sky',
    'Echoes of the Past',
    'Beyond the Horizon',
    'Whispers of Time',
  ]
  const quotesContent = [
    'Truth is stranger than fiction.',
    "When you reach for the stars, you may not quite get them, but you won't come up with a handful of mud either.",
    "Life is what happens when you're busy making other plans.",
    'Knowledge is power.',
    'To be or not to be.',
  ]
  const userNames = ['Blake', 'Jordan', 'Casey', 'Alex', 'Morgan']

  // Create multiple authors, books, and quotes
  while (authors.length > 0 && titles.length > 0) {
    const authorName = authors.pop()!
    const bookTitle = titles.pop()!

    const book = await prisma.book.create({
      data: {
        title: bookTitle,
        author: {
          create: {
            name: authorName,
          },
        },
      },
    })

    // Create multiple users
    const userName = userNames[randomInt(userNames.length)]
    const user = await prisma.user.create({
      data: {
        name: userName,
      },
    })

    // Create multiple quotes per book
    for (let j = 0; j < 3; j++) {
      const content = quotesContent[randomInt(quotesContent.length)]

      const quote = await prisma.quote.create({
        data: {
          content: content,
          createdAt: new Date(),
          userId: user.id,
          bookId: book.id,
        },
      })

      // Randomly decide if this quote should be a favorite
      if (Math.random() > 0.5) {
        await prisma.userFavorite.create({
          data: {
            userId: user.id,
            quoteId: quote.id,
          },
        })
      }
    }
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
