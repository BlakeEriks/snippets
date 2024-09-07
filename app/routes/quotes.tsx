import { getBooks } from '@/db/book.db'
import { getQuotes } from '@/db/quote.db'
import { requireUserId } from '@/session.server'
import { superjson, useSuperLoaderData } from '@/utils/data'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { useState } from 'react'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request)

  const quotes = await getQuotes(userId)
  const books = await getBooks(userId)

  return superjson({ quotes, books })
}

export const action = async ({ request }: ActionFunctionArgs) => {}

const Quotes = () => {
  const { quotes, books } = useSuperLoaderData<typeof loader>()
  const [query, setQuery] = useState('')
  const [bookId, setBookId] = useState<number | null>(null)

  const filteredQuotes = quotes
    .filter(quote => quote.content.toLowerCase().includes(query.toLowerCase()))
    .filter(quote => bookId === null || quote.bookId === bookId)

  return <Outlet />
}

export default Quotes
