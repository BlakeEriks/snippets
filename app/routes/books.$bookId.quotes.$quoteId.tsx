import QuoteForm from '@/components/QuoteForm'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getBooks } from '@/prisma/src/book.db'
import { requireUserId } from '@/session.server'
import { superjson, useSuperLoaderData } from '@/utils/data'
import { handleQuoteAction } from '@/utils/quoteAction'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { useNavigate } from '@remix-run/react'

export const action = async ({ request, params: { quoteId } }: ActionFunctionArgs) =>
  handleQuoteAction(request, () => '../..', quoteId)

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request)
  const { bookId, quoteId } = params

  const books = await getBooks(userId)
  const book = books.find(book => book.id === Number(bookId))
  if (!book) throw new Response('Book Not Found', { status: 404 })

  const quote = book.quotes.find(quote => quote.id === Number(quoteId))
  if (!quote) throw new Response('Quote Not Found', { status: 404 })

  return superjson({ books, quote })
}

const EditQuoteRoute = () => {
  const { books, quote } = useSuperLoaderData<typeof loader>()
  const navigate = useNavigate()

  return (
    <Dialog open={true} onOpenChange={() => navigate(-1)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Quote</DialogTitle>
          <DialogDescription>Update the details of the quote below.</DialogDescription>
        </DialogHeader>
        <QuoteForm quote={quote} books={books} />
        <DialogFooter>
          <Button form='quote-form'>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditQuoteRoute
