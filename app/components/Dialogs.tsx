import useDialog from '@/hook/dialog'
import NewUserDialog from './NewUserDialog'

type DialogComponent = (props: { close: () => void }) => JSX.Element

const DIALOG_COMPONENT_MAP: Record<string, DialogComponent> = {
  'new-user': NewUserDialog,
}

const Dialogs = () => {
  const [dialog, setDialog] = useDialog()

  if (!dialog) {
    return null
  }
  const DialogComponent = DIALOG_COMPONENT_MAP[dialog]

  return <DialogComponent close={() => setDialog(null)} />
}

export default Dialogs
