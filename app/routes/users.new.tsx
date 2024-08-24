import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createUser } from '@/db/user.db'
import { zodResolver } from '@hookform/resolvers/zod'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { Form, useNavigate } from '@remix-run/react'
import { getValidatedFormData, useRemixForm } from 'remix-hook-form'
import { redirectWithSuccess } from 'remix-toast'
import { z } from 'zod'

const NewUserSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
})

type NewUserFormData = z.infer<typeof NewUserSchema>

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
    await createUser(data)
    return redirectWithSuccess('/users', { message: 'User created!' })
  } catch (error) {
    return json({ errorMessage: 'Failed to create user' }, { status: 400 })
  }
}

const NewUser = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useRemixForm<NewUserFormData>({
    mode: 'onSubmit',
  })
  const navigate = useNavigate()

  return (
    <Dialog onOpenChange={() => navigate('/users')} open={true}>
      <DialogContent>
        <Form method='post' onSubmit={handleSubmit} className='space-y-4'>
          <DialogHeader className='pb-2'>
            <DialogTitle>New User</DialogTitle>
          </DialogHeader>
          <Label>
            Name:
            <Input type='text' {...register('name')} />
            {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
          </Label>
          <DialogFooter>
            <Button type='submit'>Save</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewUser
