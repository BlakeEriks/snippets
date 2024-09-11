import { Button } from '@/components/ui/button'
import { saveClippings } from '@/prisma/src/clipping.db'
import { requireUserId } from '@/session.server'
import { ActionFunctionArgs } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { redirectWithSuccess } from 'remix-toast'

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const file = formData.get('file')

  if (!file || typeof file === 'string') {
    throw new Response(null, {
      status: 400,
      statusText: 'File is required',
    })
  }

  const fileBuffer = await file.arrayBuffer()
  const fileContent = Buffer.from(fileBuffer).toString('utf-8')

  // Example: Save the file content to your database
  const quotes = await saveClippings(fileContent, userId)
  return redirectWithSuccess('/books', { message: `Uploaded ${quotes.count} Quotes` })
}

const UploadSnippetsPage = () => {
  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold'>Upload Snippets</h2>
      <ol>
        <li>1. Connect your Amazon Kindle to your computer</li>
        <li>2. Navigate to the files on your Kindle</li>
        <li>3. Locate the file named `My Clippings.txt`</li>
        <li>4. Upload the file here</li>
      </ol>
      <Form
        method='post'
        encType='multipart/form-data'
        className='flex flex-col items-start space-y-2'
      >
        <input type='file' name='file' />
        <Button type='submit'>Upload</Button>
      </Form>
    </div>
  )
}

export default UploadSnippetsPage
