import { Input } from '@/components/ui/input'
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getBooks } from '@/db/book.db'
import { getQuotes } from '@/db/quote.db'
import { requireUserId } from '@/session.server'
import { superjson, useSuperLoaderData } from '@/utils/data'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
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

  return (
    <div className='space-y-2'>
      <h2 className='text-xl font-bold px-2'>Quotes</h2>
      <div className='flex gap-x-4'>
        <Input
          type='search'
          placeholder='Search Quotes'
          value={query}
          onChange={e => setQuery(e.target.value)}
          className='w-80'
        />
        <SelectRoot onValueChange={id => setBookId(Number(id))} value={String(bookId)}>
          <SelectTrigger className='w-80'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {books?.map(book => (
              <SelectItem key={book.id} value={String(book.id)}>
                {book.title}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      </div>
      <div className='flex flex-col'>
        {filteredQuotes.map(quote => (
          <div key={quote.id} className='p-2 border-b'>
            <p className='text-sm'>{quote.content}</p>
            <p className='text-xs text-gray-500'>{quote.quotee}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Quotes
