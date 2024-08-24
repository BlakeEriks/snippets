import { getBooks } from '@/db/book.db'
import { requireUserId } from '@/session.server'
import { LoaderFunction } from '@remix-run/node'
import { Outlet, json, redirect, useLoaderData, useRouteError } from '@remix-run/react'
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

  if (!bookId) {
    return redirect(`/books/${books[0].id}`)
  }

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
    <div className='flex flex-1 overflow-y-auto max-h-full'>
      {/* <div className='flex flex-col w-[300px] border-r'> */}
      {/* <h2 className='text-center text-xl font-bold border-b p-2'>Books</h2>
        <NavigationMenu className='p-2 flex-1 overflow-y-auto'>
          <NavigationMenuList className='flex-col h-full items-start space-y-1 overflow-y-auto'>
            {books.map(({ id, title }) => (
              <NavigationMenuItem
                key={id}
                className={cn(
                  'py-1 w-full hover:bg-accent hover:text-accent-foreground transition-colors',
                  id === Number(bookId) && 'bg-accent text-accent-foreground'
                )}
              >
                <NavigationMenuLink asChild>
                  <Link to={`./${id}`} className='block leading-6'>
                    {title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))} 
          </NavigationMenuList>
        </NavigationMenu> */}
      {/* </div> */}
      <Outlet />
    </div>
  )
}

export default Books
