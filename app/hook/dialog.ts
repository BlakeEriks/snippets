import { useLocation, useNavigate, useSearchParams } from '@remix-run/react'
import { useCallback } from 'react'

type UseDialogType = [string | null, (val: string | null) => void]

const useDialog = (): UseDialogType => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  const dialog = searchParams.get('dialog')

  const setDialog = useCallback(
    (dialog: string | null) => {
      const url = new URL(location.pathname + location.search, window.location.origin)
      if (dialog === null) {
        url.searchParams.delete('dialog')
      } else {
        url.searchParams.set('dialog', dialog)
      }
      navigate(url.pathname + url.search)
    },
    [location, dialog]
  )

  return [dialog, setDialog]
}

export default useDialog
