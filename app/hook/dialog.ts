import { useLocation, useNavigate, useSearchParams } from '@remix-run/react'
import { useCallback } from 'react'

type UseDialogType = [string | null, (val: string | null) => void]

const useDialog = (): UseDialogType => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  const dialog = searchParams.get('dialog')

  const setDialog = useCallback(
    (dialog: string | null) => navigate(dialog === null ? '.' : '?dialog=' + dialog),
    [dialog]
  )

  return [dialog, setDialog]
}

export default useDialog
