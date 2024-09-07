import useDialog from '@/hook/dialog'
import { User } from '@prisma/client'
import { useFetcher } from '@remix-run/react'
import { CircleUser, LoaderCircle, Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from './ui/button'
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValue } from './ui/select'
import { TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from './ui/tooltip'

type HeaderProps = {
  user: User | null
  users: User[]
}

const Header = ({ user, users }: HeaderProps) => {
  const fetcher = useFetcher()
  const [selectOpen, setSelectOpen] = useState(false)
  const formRef = useRef<any>()
  const [, setDialog] = useDialog()

  const submitForm = (newUserId: string) => {
    const form = formRef.current
    if (!form || !newUserId) return

    form.elements['userId'].value = newUserId
    fetcher.submit(form)
  }

  const loading = fetcher.state !== 'idle'

  return (
    <header className='flex flex-row w-full justify-between py-2 px-4 border-b-2'>
      <h1 className='text-4xl italic font-semibold'>
        Quotes<span className='opacity-50 font-light'> - the app</span>
      </h1>
      <div className='flex gap-2'>
        <fetcher.Form ref={formRef} method='post' action='/set-user'>
          <SelectRoot
            name='userId'
            open={selectOpen}
            onOpenChange={setSelectOpen}
            onValueChange={submitForm}
            value={String(user?.id)}
          >
            <SelectTrigger className='w-60' disabled={loading}>
              <div className='flex items-center gap-2'>
                {loading ? <LoaderCircle className='animate-spin' /> : <CircleUser />}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {users?.map((user, index) => (
                <SelectItem key={index} value={String(user.id)}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </fetcher.Form>
        <TooltipProvider>
          <TooltipRoot delayDuration={100}>
            <TooltipTrigger asChild>
              <Button variant='outline' onClick={() => setDialog('new-user')} type='button'>
                <Plus size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>New User</TooltipContent>
          </TooltipRoot>
        </TooltipProvider>
      </div>
    </header>
  )
}

export default Header
