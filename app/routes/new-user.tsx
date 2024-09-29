import { NewUserFormData } from '@/components/NewUserDialog'
import { createSessionHeaders } from '@/session.server'
import { zodResolver } from '@hookform/resolvers/zod'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { createUser } from 'prisma-db'
import { getValidatedFormData } from 'remix-hook-form'
import { redirectWithSuccess } from 'remix-toast'
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
    const headers = await createSessionHeaders(request, String(user.id))
    return redirectWithSuccess('/home', 'New User Created', { headers })
  } catch (error) {
    return json({ errorMessage: 'Failed to create user' }, { status: 400 })
  }
}
