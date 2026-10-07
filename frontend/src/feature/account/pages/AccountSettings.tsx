import { type FormEvent, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { initials } from '@/feature/layout/Icon'
import { ThemeSettings } from '@/feature/theme/components/ThemeSettings'
import { useAccountStore, useUserStore } from '@/store'

export function AccountSettings() {
  const { user } = useUserStore()
  const [name, setName] = useState(user?.name ?? '')
  const {
    profileSaving: saving,
    accountDeleting: deleting,
    profileError: error,
    deleteError,
    updateName,
    deleteAccount,
    clearAccountErrors,
  } = useAccountStore()
  const [message, setMessage] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  async function save(event: FormEvent) {
    event.preventDefault()
    setMessage('')
    try {
      const updated = await updateName(name.trim())
      if (!updated) return
      setName(updated.name)
      setMessage('Your profile has been updated.')
    } catch {
      // The store exposes the request error to the form.
    }
  }
  async function remove() {
    try {
      await deleteAccount()
      setDeleteOpen(false)
    } catch {
      // Keep the dialog open; the store exposes the deletion error.
    }
  }
  return (
    <section className="mx-auto w-full max-w-4xl">
      <div className="flex flex-col gap-8">
        <Card>
          <div className="px-6 pt-6">
            <h2 className="font-semibold text-lg text-text-primary leading-none tracking-tight">
              Profile Information
            </h2>
            <p className="text-text-secondary text-sm mt-1.5">Update your personal information.</p>
          </div>
          <div className="p-6">
            <form onSubmit={save} className="flex flex-col gap-6">
              <div>
                <p className="text-sm font-medium text-text-secondary">Profile picture</p>
                <div className="flex justify-between items-center gap-3">
                  <p className="text-text-secondary text-[12px]">
                    Your initials are used as your profile picture.
                  </p>
                  <Avatar size={40}>
                    <AvatarFallback>{initials(user?.name)}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={name}
                  disabled={saving || deleting}
                  onChange={event => {
                    setName(event.target.value)
                    setMessage('')
                  }}
                />
              </div>
              {error && (
                <p role="alert" className="text-sm text-error">
                  {error}
                </p>
              )}
              {message && (
                <p role="status" className="text-sm text-success">
                  {message}
                </p>
              )}
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="self-end"
                loading={saving}
                disabled={deleting || !name.trim() || name.trim() === user?.name}
              >
                Save changes
              </Button>
            </form>
          </div>
        </Card>
        <Card>
          <div className="px-6 pt-6">
            <h2 className="font-semibold text-lg text-text-primary leading-none tracking-tight">
              Google account
            </h2>
            <p className="text-text-secondary text-sm mt-1.5">
              This is the email address you use to sign in with Google.
            </p>
          </div>
          <div className="p-6">
            <Input
              id="email"
              name="email"
              type="email"
              aria-label="Email address"
              value={user?.email ?? ''}
              disabled
            />
          </div>
        </Card>
        <Card>
          <div className="px-6 pt-6">
            <h2 className="font-semibold text-lg text-text-primary leading-none tracking-tight">
              App Settings
            </h2>
          </div>
          <div className="p-6">
            <ThemeSettings />
          </div>
        </Card>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-(--color-border-secondary)" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-8 font-semibold text-error">Danger Zone</span>
          </div>
        </div>
        <Card className="border-(--color-border-primary)">
          <div className="p-6">
            <h2 className="font-semibold text-lg text-error leading-none tracking-tight">
              Delete account
            </h2>
            <p className="text-text-secondary text-sm mt-1.5">
              Once you delete your account, there is no going back. Your studio profile will be
              deleted and all active sessions will end. <b>This action is not reversible.</b>
            </p>
          </div>
          <div className="p-6 flex justify-end">
            <Button
              variant="destructive"
              size="sm"
              className="w-full md:w-auto"
              type="button"
              disabled={saving || deleting}
              onClick={() => {
                clearAccountErrors()
                setDeleteOpen(true)
              }}
            >
              Delete
            </Button>
          </div>
        </Card>
      </div>
      <AlertDialog
        open={deleteOpen}
        onOpenChange={open => {
          if (!deleting) setDeleteOpen(open)
        }}
      >
        <AlertDialogContent
          onEscapeKeyDown={event => {
            if (deleting) event.preventDefault()
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your account? Your studio profile will be permanently
              deleted and you will be signed out on every device.{' '}
              <b>This action cannot be undone.</b>
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p role="alert" className="text-sm text-error">
              {deleteError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel variant="secondary" size="sm" disabled={deleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              size="sm"
              disabled={deleting}
              onClick={event => {
                event.preventDefault()
                void remove()
              }}
            >
              {deleting ? 'Deleting…' : 'Delete account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
