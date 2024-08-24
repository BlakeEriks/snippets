import { Button } from '@/components/ui/button'
import { getUsers } from '@/db/user.db'
import { createUserSession } from '@/session.server'
import { User } from '@prisma/client'
import { ActionFunction, LoaderFunction, json } from '@remix-run/node'
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'

export const loader: LoaderFunction = async () => json(await getUsers())

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const userId = formData.get('userId')

  invariant(typeof userId === 'string', 'User ID is required')

  return createUserSession({
    request,
    userId,
    remember: true,
    redirectTo: '/books',
  })
}

const Users = () => {
  const users = useLoaderData<typeof loader>()

  return (
    <div className='flex-1'>
      <h1 className='text-2xl text-center my-6'>Whos Using Quotes?</h1>
      <div className='flex justify-center'>
        <Form method='post'>
          {users.map(({ name, id }: User) => (
            <Button
              key={id}
              className='text-center w-32 mx-2 py-12 border border-slate-300 rounded-3xl hover:shadow-lg transition-shadow cursor-pointer'
              // onClick={() => selectUser(id)}
              name='userId'
              value={id}
            >
              {name}
            </Button>
          ))}
        </Form>
        <Button
          className='text-center w-32 mx-2 py-12 border border-slate-300 rounded-3xl hover:shadow-lg transition-shadow cursor-pointer'
          asChild
        >
          <Link to='./new'>+</Link>
        </Button>
      </div>
      <Outlet />
    </div>
  )
}

export default Users
