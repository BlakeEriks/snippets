import useDialog from '@/hook/dialog'
import { User } from '@prisma/client'
import { Form, useSubmit } from '@remix-run/react'
import { CircleUser, Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from './ui/button'
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValue } from './ui/select'
import { Separator } from './ui/separator'

type HeaderProps = {
  user: User | null
  users: User[]
}

const Header = ({ user, users }: HeaderProps) => {
  const submit = useSubmit()
  const [selectOpen, setSelectOpen] = useState(false)
  const selectRef = useRef<any>()
  const [, setDialog] = useDialog()

  const handleAddNewUserParam = () => {
    setSelectOpen(false)
    setDialog('new-user')
  }

  return (
    <header className='flex flex-row w-full justify-between py-2 px-4 border-b-2'>
      <h1 className='text-4xl italic font-semibold'>
        Quotes<span className='opacity-50 font-light'> - the app</span>
      </h1>
      <div>
        <Form method='post' action='/set-user' onChange={e => submit(e.currentTarget)}>
          <SelectRoot
            defaultValue={String(user?.id)}
            name='userId'
            open={selectOpen}
            onOpenChange={setSelectOpen}
          >
            <SelectTrigger name='userId' className='w-60' ref={selectRef}>
              <div className='flex items-center gap-2'>
                <CircleUser />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {users?.map(user => (
                <SelectItem key={user.id} value={String(user.id)}>
                  {user.name}
                </SelectItem>
              ))}
              <Separator />
              <Button
                onClick={handleAddNewUserParam}
                variant='ghost'
                className='mt-1 w-full'
                type='button'
              >
                <Plus className='inline' size={20} />
                <span>Create User</span>
              </Button>
            </SelectContent>
          </SelectRoot>
        </Form>
      </div>
    </header>
  )
}

export default Header
