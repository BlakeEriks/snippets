import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { requireUserId } from '@/session.server'
import { superjson, useSuperLoaderData } from '@/utils/data'
import { ActionFunction, LoaderFunctionArgs, redirect } from '@remix-run/node'
import { Form, Link, useNavigate } from '@remix-run/react'
import _ from 'lodash'
import { Copy, Edit2, Heart, Plus, Undo2, X } from 'lucide-react'
import { getBooks, getFavorites, getQuotes, toggleDeleted, toggleFavorite } from 'prisma-db'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

type Quote = Awaited<ReturnType<typeof getQuotes>>[0]

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request)
  const quotes = await getQuotes(userId)
  const books = await getBooks(userId)
  const favorites = await getFavorites(userId)

  return superjson({ quotes, books, favorites })
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)

  const formData = await request.formData()
  const quoteId = Number(formData.get('quoteId'))
  const intent = formData.get('intent')

  if (intent === 'favorite') {
    console.log(userId, quoteId)
    await toggleFavorite(userId, Number(quoteId))
    return redirect(`/quotes`)
  }
  if (intent === 'delete') {
    await toggleDeleted(Number(quoteId))
    return redirect(`/books/${params.bookId}`)
  }

  return redirect(`/quotes`)
}

const Quotes = () => {
  const { quotes, books, favorites } = useSuperLoaderData<typeof loader>()
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
          <Quote key={quote.id} quote={quote} favorite={favorites.includes(quote.id)} />
        ))}
      </div>
    </div>
  )
}

type QuoteProps = {
  quote: Quote
  favorite: boolean
}

const Quote = ({ quote: { id, content, quotee, deleted }, favorite }: QuoteProps) => {
  const navigate = useNavigate()

  return (
    <Form key={id} method='post'>
      <div className='flex justify-between'>
        <Link to={id.toString()} key={id} className='p-2 border-b'>
          <p className='text-sm'>{content}</p>
          <p className='text-xs text-gray-500'>{quotee}</p>
        </Link>
        <div className='flex justify-center'>
          <Button
            name='intent'
            value='favorite'
            variant='ghost'
            size='sm'
            // disabled={loading[id]}
            className='opacity-50 hover:opacity-80 transition-all scale-110'
          >
            <Heart className={cn('shrink-0')} size={12} fill={favorite ? 'red' : 'none'} />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            // disabled={loading[id]}
            onClick={() => navigate(`./quotes/${id}`)}
            className='opacity-50 hover:opacity-80 transition-all scale-110'
          >
            <Edit2 className='shrink-0' size={12} />
          </Button>
          <CopyButton content={content} />
          <Button
            name='intent'
            value='delete'
            variant='ghost'
            size='sm'
            // disabled={loading[id]}
            className='opacity-50 hover:opacity-80 transition-all scale-110'
          >
            {deleted ? (
              <Undo2 className='shrink-0' size={12} />
            ) : (
              <X className='shrink-0' size={12} />
            )}
          </Button>
        </div>
      </div>
      <input type='hidden' name='quoteId' value={id} />
    </Form>
  )
}

const CopyButton = ({ content }: { content: string }) => {
  const handleCopy = useCallback(
    _.debounce(
      () => {
        navigator.clipboard.writeText(content)
        toast.success('Copied!')
      },
      500,
      { leading: true },
    ),
    [],
  )

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={handleCopy}
      className='opacity-50 hover:opacity-80 transition-all scale-110'
    >
      <Copy className='shrink-0' size={12} />
    </Button>
  )
}

export default Quotes
