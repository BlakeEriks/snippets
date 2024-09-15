import QuoteForm from '@/components/QuoteForm'
import { Button } from '@/components/ui/button'
import { requireUserId } from '@/session.server'
import { superjson, useSuperLoaderData } from '@/utils/data'
import { handleQuoteAction } from '@/utils/quoteAction'
import { getBooks } from '@db/quippets/book.db'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { ArrowLeft } from 'lucide-react'

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
      <div className='flex gap-2 items-center border-b'>
        <Button asChild variant='ghost'>
          <Link to='..'>
            <ArrowLeft />
            {/* <span className='ml-2 text-lg'>Back</span> */}
          </Link>
        </Button>
        <h2 className='text-lg font-bold flex-1'>New Quote</h2>
      </div>
      <QuoteForm books={books} />
      <Button form='quote-form'>Save</Button>
    </div>
  )
}

export default NewQuote
