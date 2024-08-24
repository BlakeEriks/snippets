import { Books } from '@/db/book.db'
import { QuoteFormData } from '@/utils/quoteAction'
import { Form } from '@remix-run/react'
import { Controller } from 'react-hook-form'
import { useRemixForm } from 'remix-hook-form'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'

const QuoteForm = ({ quote, books }: { quote?: QuoteFormData; books: Books }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useRemixForm<QuoteFormData>({
    mode: 'onSubmit',
    defaultValues: {
      content: quote?.content,
      quotee: quote?.quotee ?? '',
      bookId: quote?.bookId ?? null,
    },
  })

  return (
    <Form id='quote-form' method='post' onSubmit={handleSubmit} className='space-y-4'>
      <Label>
        Content:
        <Textarea {...register('content')} rows={12} className='h-48' />
        {errors.content && <p className='text-red-500'>{errors.content.message}</p>}
      </Label>
      <Label>
        Quotee:
        <Input type='text' {...register('quotee')} />
        {errors.quotee && <p className='text-red-500'>{errors.quotee.message}</p>}
      </Label>
      <Label>
        Book:
        <Controller
          name='bookId'
          control={control}
          render={({ field }) => (
            <Select onValueChange={id => field.onChange(Number(id))} value={String(field.value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {books?.map(book => (
                  <SelectItem key={book.id} value={String(book.id)}>
                    {book.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.bookId && <p className='text-red-500'>{errors.bookId.message}</p>}
      </Label>
    </Form>
  )
}

export default QuoteForm
