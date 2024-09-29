import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { requireUserId } from '@/session.server'
import { superjson, useSuperLoaderData } from '@/utils/data'
import { LoaderFunctionArgs } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { Plus } from 'lucide-react'
import { getBooks, getQuotes } from 'prisma-db'
import { useState } from 'react'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request)

  const quotes = await getQuotes(userId)
  const books = await getBooks(userId)

  return superjson({ quotes, books })
}

// export const action = async ({ request }: ActionFunctionArgs) => {}

const Quotes = () => {
  const { quotes, books } = useSuperLoaderData<typeof loader>()
  const [query, setQuery] = useState('')
  const [bookId, setBookId] = useState<number | undefined>(undefined)

  const filteredQuotes = quotes
    .filter(quote => quote.content.toLowerCase().includes(query.toLowerCase()))
    .filter(quote => !bookId || quote.bookId === bookId)

  return (
    <div className='space-y-2'>
      <div className='flex gap-x-2 items-center border-b pb-2'>
        <h2 className='text-xl font-bold w-full px-4'>Quotes</h2>
        <Input
          type='search'
          placeholder='Search Quotes'
          value={query}
          onChange={e => setQuery(e.target.value)}
          className='w-80'
        />
        <SelectRoot
          onValueChange={id => setBookId(Number(id))}
          value={bookId ? String(bookId) : undefined}
        >
          <SelectTrigger className='w-80'>
            <SelectValue placeholder='Select Book' />
          </SelectTrigger>
          <SelectContent>
            {books?.map(book => (
              <SelectItem key={book.id} value={String(book.id)}>
                {book.title}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
        <Button asChild variant='outline' type='button'>
          <Link to='new'>
            <Plus size={20} />
          </Link>
        </Button>
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
