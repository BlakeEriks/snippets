import { NewUserFormData } from '@/components/NewUserDialog'
import { createUser } from '@/db/user.db'
import { createUserSession } from '@/session.server'
import { zodResolver } from '@hookform/resolvers/zod'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { getValidatedFormData } from 'remix-hook-form'
import { z } from 'zod'

export const NewUserSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
})

const resolver = zodResolver(NewUserSchema)

export const action = async ({ request }: ActionFunctionArgs) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<NewUserFormData>(request, resolver)

  if (errors) {
    return json({ errors, defaultValues })
  }

  try {
    const user = await createUser(data)
    return createUserSession({
      request,
      userId: String(user.id),
      remember: true,
      redirectTo: '/home',
    })
  } catch (error) {
    return json({ errorMessage: 'Failed to create user' }, { status: 400 })
  }
}
