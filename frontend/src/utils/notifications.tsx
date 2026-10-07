import { toast } from 'sonner'

const NOTIFICATION_POSITION = 'top-center' as const

export const showNotification = (type: 'success' | 'error', message: string) => {
  if (type === 'success') {
    toast.success(message, {
      className: 'success',
      position: NOTIFICATION_POSITION,
    })
  } else {
    toast.error(message, {
      className: 'error',
      position: NOTIFICATION_POSITION,
    })
  }
}

interface LoadingNotificationController {
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  update: (props: {
    loading?: boolean
    message: string
    title?: string
    color?: string
    autoClose?: number | false
  }) => void
}

export const showLoadingNotification = (
  title: string,
  message: string
): LoadingNotificationController => {
  const id = toast.loading(title, {
    description: message,
    duration: Number.POSITIVE_INFINITY,
    position: NOTIFICATION_POSITION,
  })

  return {
    success: (successMessage: string, successTitle: string = 'Success') => {
      toast.success(successTitle, {
        id,
        description: successMessage,
        duration: 4000,
        className: 'success',
        position: NOTIFICATION_POSITION,
      })
    },
    error: (errorMessage: string, errorTitle: string = 'Error') => {
      toast.error(errorTitle, {
        id,
        description: errorMessage,
        duration: 4000,
        className: 'error',
        position: NOTIFICATION_POSITION,
      })
    },
    update: props => {
      toast.loading(props.title ?? title, {
        id,
        description: props.message,
        duration: props.autoClose === false ? Number.POSITIVE_INFINITY : (props.autoClose ?? 4000),
        position: NOTIFICATION_POSITION,
      })
    },
  }
}

export const withLoadingNotification = async <T,>(
  promise: Promise<T>,
  config: {
    loading: { title: string; message: string }
    success: { title?: string; message: string }
    error: { title?: string; message: string }
  }
): Promise<T> => {
  const notification = showLoadingNotification(config.loading.title, config.loading.message)

  try {
    const result = await promise
    notification.success(config.success.message, config.success.title)
    return result
  } catch (error) {
    notification.error(config.error.message, config.error.title)
    throw error
  }
}
