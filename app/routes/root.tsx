import { requireUser } from '@/session.server'
import { LoaderFunction, type MetaFunction } from '@remix-run/node'
import { Outlet } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export const loader: LoaderFunction = async ({ request }) => {
  console.log('loader index')
  await requireUser(request)
  // return redirect('/books')
}

export default function Index() {
  return <Outlet />
}
