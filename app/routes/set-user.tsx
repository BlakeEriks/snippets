import { createUserSession } from '@/session.server'
import { ActionFunctionArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const userId = formData.get('userId')

  invariant(typeof userId === 'string', 'User ID is required')

  return createUserSession({
    request,
    userId,
    remember: true,
    redirectTo: '/home',
  })
}
