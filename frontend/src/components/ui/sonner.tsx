import { CircleAlert, CircleCheck, Loader2 } from 'lucide-react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import './styles/sonner.css'

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="app-toaster"
      position="top-center"
      duration={4000}
      icons={{
        success: <CircleCheck size={18} strokeWidth={2.5} />,
        error: <CircleAlert size={18} strokeWidth={2.5} />,
        loading: <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />,
      }}
      {...props}
    />
  )
}
