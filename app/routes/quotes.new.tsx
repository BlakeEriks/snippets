import QuoteForm from '@/components/QuoteForm'
import { Button } from '@/components/ui/button'
import { getBooks } from '@/db/book.db'
import { requireUserId } from '@/session.server'
import { superjson, useSuperLoaderData } from '@/utils/data'
import { handleQuoteAction } from '@/utils/quoteAction'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request)
  const books = await getBooks(userId)
  return superjson({ books })
}

export const action = async ({ request }: ActionFunctionArgs) =>
  handleQuoteAction(request, quoteId => `/quotes/${quoteId}`)

const NewQuote = () => {
  const { books } = useSuperLoaderData<typeof loader>()

  return (
    <div className='mx-auto p-4 space-y-4'>
      <h2 className='text-lg font-bold'>New Quote</h2>
      <QuoteForm books={books} />
      <Button form='quote-form'>Save</Button>
    </div>
  )
}

export default NewQuote
