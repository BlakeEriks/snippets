import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useLocation,
  useRouteError,
} from '@remix-run/react'
import './globals.css'

import { ThemeSwitcherSafeHTML, ThemeSwitcherScript } from '@/components/theme-switcher'

import { LoaderFunction, json } from '@remix-run/node'
import { Book, Quote, Upload } from 'lucide-react'
import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { getToast } from 'remix-toast'
import Header from './components/Header'
import { buttonVariants } from './components/ui/button'
import { cn } from './lib/utils'
import { getUser } from './session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const { toast, headers } = await getToast(request)
  return json({ toast, user: await getUser(request) }, { headers })
}

function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeSwitcherSafeHTML lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
        <ThemeSwitcherScript />
      </head>
      <body className='dark'>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster />
      </body>
    </ThemeSwitcherSafeHTML>
  )
}

export default function Root() {
  const { user, toast: toastData } = useLoaderData<typeof loader>()
  const location = useLocation()

  console.log(location.pathname)

  useEffect(() => {
    if (!toastData) return

    switch (toastData.type) {
      case 'error':
        toast.error(toastData.message)
        break
      case 'success':
        toast.success(toastData.message)
        break
    }
  }, [toastData])

  return (
    <App>
      <div className='flex flex-col h-[100vh]'>
        <Header user={user} />
        <div className='flex py-2'>
          <nav className='flex flex-col gap-1 px-2 w-64 border-r'>
            <Link
              to='/books'
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                location.pathname.includes('books') && 'bg-accent',
                'justify-start gap-x-1'
              )}
            >
              <Book size={18} />
              <span>Books</span>
            </Link>
            <Link
              to='/quotes'
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                location.pathname.includes('quotes') && 'bg-accent',
                'justify-start gap-x-1'
              )}
            >
              <Quote size={18} />
              Quotes
            </Link>
            <Link
              to='/upload-snippets'
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                location.pathname.includes('upload-snippets') && 'bg-accent',
                'justify-start gap-x-1'
              )}
            >
              <Upload size={18} />
              Upload
            </Link>
          </nav>
          <Outlet />
        </div>
      </div>
    </App>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  let status = 500
  let message = 'An unexpected error occurred.'
  if (isRouteErrorResponse(error)) {
    status = error.status
    switch (error.status) {
      case 404:
        message = 'Page Not Found'
        break
    }
  } else {
    console.error(error)
  }

  return (
    <App>
      <div className='container prose py-8'>
        <h1>{status}</h1>
        <p>{message}</p>
      </div>
    </App>
  )
}
