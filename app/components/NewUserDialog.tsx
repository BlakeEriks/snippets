import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NewUserSchema } from '@/routes/new-user'
import { Form } from '@remix-run/react'
import { useRemixForm } from 'remix-hook-form'
import { z } from 'zod'

export type NewUserFormData = z.infer<typeof NewUserSchema>

const NewUserDialog = ({ close }: { close: () => void }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useRemixForm<NewUserFormData>({
    mode: 'onSubmit',
    submitConfig: {
      action: '/new-user',
    },
  })

  return (
    <Dialog open={true} onOpenChange={close}>
      <DialogContent>
        <Form method='post' onSubmit={handleSubmit} className='space-y-4'>
          <DialogHeader className='pb-2'>
            <DialogTitle>New User</DialogTitle>
            <DialogDescription>
              Enter the name of the user you would like to create.
            </DialogDescription>
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

export default NewUserDialog
