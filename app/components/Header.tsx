import { cn } from '@/lib/utils'
import { User } from '@prisma/client'
import { Link, useLocation } from '@remix-run/react'
import { ArrowLeftRight, PlusIcon, SmileIcon, UploadIcon } from 'lucide-react'
import Tooltip from './Tooltip'

const Header = ({ user }: { user: User }) => {
  const { pathname } = useLocation()

  return (
    <header className='flex flex-row w-full justify-between py-2 px-4 border-b-2'>
      <Link to='/books' className={cn('flex', pathname.includes('books') && 'pointer-events-none')}>
        <h1 className='text-4xl italic font-semibold'>Quotes</h1>
        <h1 className='text-4xl italic font-light opacity-50'> - the app</h1>
      </Link>
      <div className='flex items-center gap-2'>
        {/* <Tooltip>

        </Tooltip> */}
        <Tooltip content='Random Quote' asChild>
          {/* <Link to={`random/${new Date().getTime()}`}> */}
          <ArrowLeftRight />
          {/* </Link> */}
        </Tooltip>
        <Link to='/upload-snippets'>
          <Tooltip content='Upload Snippets'>
            <UploadIcon />
          </Tooltip>
        </Link>
        <Tooltip content='Add Quote' asChild>
          <Link to='quotes/new'>
            <PlusIcon />
          </Link>
        </Tooltip>
        <Link to='users'>
          <Tooltip content='Change User'>
            {/* {user ? 'user' : <SmileIcon />} */}
            {user ? user.name[0].toUpperCase() : <SmileIcon />}
          </Tooltip>
        </Link>
      </div>
    </header>
  )
}

export default Header
