import { cn } from '@/lib/utils'
import { Link, useLocation } from '@remix-run/react'
import { Book, HomeIcon, Quote, Upload } from 'lucide-react'
import { buttonVariants } from './ui/button'

const Nav = () => {
  const { pathname } = useLocation()

  return (
    <nav className='flex flex-col gap-1 px-2 w-64 border-r'>
      <Link
        to='/home'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          pathname.includes('home') && 'bg-accent',
          'justify-start gap-x-1'
        )}
      >
        <HomeIcon size={18} />
        <span>Home</span>
      </Link>
      <Link
        to='/books'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          pathname.includes('books') && 'bg-accent',
          'justify-start gap-x-1'
        )}
      >
        <Book size={18} />
        <span>Books</span>
      </Link>
      <Link
        to='/quotes'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          pathname.includes('quotes') && 'bg-accent',
          'justify-start gap-x-1'
        )}
      >
        <Quote size={18} />
        Quotes
      </Link>
      <Link
        to='/upload-snippets'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          pathname.includes('upload-snippets') && 'bg-accent',
          'justify-start gap-x-1'
        )}
      >
        <Upload size={18} />
        Upload
      </Link>
    </nav>
  )
}

export default Nav
