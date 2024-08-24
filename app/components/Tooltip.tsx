import { Button } from './ui/button'
import { TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from './ui/tooltip'

type TooltipProps = React.ComponentProps<typeof TooltipContent> & {
  children: React.ReactNode
  content: React.ReactNode
}

const Tooltip = ({ children, content }: TooltipProps) => {
  return (
    <TooltipProvider>
      <TooltipRoot delayDuration={100}>
        <TooltipTrigger asChild>
          <Button variant='outline'>{children}</Button>
        </TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  )
}

export default Tooltip
