import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'
import './globals'
import './globals.css'

import { ThemeSwitcherSafeHTML, ThemeSwitcherScript } from '@/components/theme-switcher'

import Dialogs from '@/components/Dialogs'
import Header from '@/components/Header'
import Nav from '@/components/Nav'
import { getUser } from '@/session.server'
import { getUsers } from '@db/user'
import { json, LoaderFunctionArgs, redirect } from '@remix-run/node'
import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { getToast } from 'remix-toast'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request)
  const users = await getUsers()

  // Get the current path
  const path = new URL(request.url).pathname
  console.log(path)
  if (!path || path === '/') {
    return redirect('home')
  }

  const { toast, headers } = await getToast(request)
  return json({ toast, user, users }, { headers })
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
        <Dialogs />
      </body>
    </ThemeSwitcherSafeHTML>
  )
}

export default function Root() {
  const { user, toast: toastData, users } = useLoaderData<typeof loader>()

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
        <Header user={user} users={users} />
        <div className='flex py-2'>
          <Nav />
          <div className='px-4 flex-1'>
            <Outlet />
          </div>
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
