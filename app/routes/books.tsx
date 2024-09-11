import { getBooks } from '@/prisma/src/book.db'
import { requireUserId } from '@/session.server'
import { LoaderFunction } from '@remix-run/node'
import { json, useLoaderData, useRouteError } from '@remix-run/react'
import _ from 'lodash'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

type LoaderData = {
  books: Awaited<ReturnType<typeof getBooks>>
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)

  const books = await getBooks(userId)
  const { bookId } = params

  if (!books.length) {
    throw new Response('No books found', { status: 404 })
  }

  // if (!bookId) {
  //   return redirect(`/books/${books[0].id}`)
  // }

  return json<LoaderData>({ books })
}

export function ErrorBoundary() {
  const error = useRouteError()

  return (
    <div className='text-red-500'>
      Oh no, something went wrong!
      <pre>{_.get(error, 'data')}</pre>
    </div>
  )
}

const Books = () => {
  const { books } = useLoaderData() as unknown as LoaderData
  const [hideDisabled, setHideDisabled] = useState(false)
  const { bookId } = useParams()

  return (
    <div>
      <div className='flex flex-1 items-center h-11 border-b'>
        <h2 className='text-xl font-bold w-full px-4 flex-1'>Books</h2>
      </div>
      <div className='flex flex-wrap overflow-y-auto max-h-full'>
        {books.map((book, index) => (
          <div key={index} className='flex flex-col p-4 flex-shrink-0 basis-1/3'>
            <h3 className='text-md'>{book.title}</h3>
            {/* <p className='text-sm'>{book.}</p> */}
          </div>
        ))}
        {/* <Outlet /> */}
      </div>
    </div>
  )
}

export default Books
