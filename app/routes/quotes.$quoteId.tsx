import { getQuoteById } from '@/prisma/src/quote.db'
import { superjson, useSuperLoaderData } from '@/utils/data'
import { LoaderFunctionArgs } from '@remix-run/node'

export const loader = async ({ params: { quoteId } }: LoaderFunctionArgs) => {
  const quote = await getQuoteById(Number(quoteId))

  return superjson({ quote })
}

const QuoteRoute = () => {
  const { quote } = useSuperLoaderData<typeof loader>()

  if (!quote) return <div>Quote not found</div>

  return (
    <div className='max-w-3xl mx-auto p-6 rounded-lg shadow-md mt-8'>
      <div className='mb-8 text-center'>
        <p className='text-2xl italic font-semibold text-white-800'>"{quote.content}"</p>
        {quote.quotee && <p className='mt-4 text-xl text-gray-600'>- {quote.quotee}</p>}
      </div>
    </div>
  )
}

export default QuoteRoute
