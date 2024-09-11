import { saveQuote } from '@/prisma/src/quote.db'
import { requireUserId } from '@/session.server'
import { zodResolver } from '@hookform/resolvers/zod'
import { json } from '@remix-run/node'
import { getValidatedFormData } from 'remix-hook-form'
import { redirectWithSuccess } from 'remix-toast'
import { z } from 'zod'

type RedirectFunction = (quoteId: number) => string

export const QuoteSchema = z.object({
  content: z.string().min(2, {
    message: 'Quote content must be at least 2 characters.',
  }),
  quotee: z
    .string()
    .min(2, { message: 'Quotee must be at least 2 characters.' })
    .nullable()
    .or(z.literal('')),
  bookId: z
    .number({
      required_error: 'Please select a book',
      invalid_type_error: 'Book ID must be a number',
    })
    .int()
    .nullable(),
})

export type QuoteFormData = z.infer<typeof QuoteSchema>

export const handleQuoteAction = async (
  request: Request,
  redirect: RedirectFunction,
  quoteId?: string
) => {
  const userId = await requireUserId(request)
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<QuoteFormData>(request, zodResolver(QuoteSchema))

  console.log('errors', errors)

  if (errors) {
    return json({ errors, defaultValues })
  }

  const id = quoteId ? Number(quoteId) : undefined
  const message = id ? 'Quote updated!' : 'Quote created!'

  try {
    const quote = await saveQuote({ ...data, userId, id })
    return redirectWithSuccess(redirect(quote.id), { message })
  } catch (error) {
    return json({ errorMessage: 'Failed to save quote' }, { status: 400 })
  }
}
