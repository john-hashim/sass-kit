import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icon } from '@/feature/layout/Icon'
import { useUserStore } from '@/store'

export function Dashboard() {
  const { user } = useUserStore()
  return (
    <section>
      <p className="text-xs font-semibold tracking-widest text-text-weak">YOUR WORKSPACE</p>
      <h2 className="mt-3 mb-2 text-[28px] font-semibold tracking-tight">
        Welcome, {user?.name.split(' ')[0]}.
      </h2>
      <p className="text-sm text-text-weak">
        You’re signed in and ready to make this space your own.
      </p>
      <Card className="mt-8 px-6 py-16 text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-xl border border-border-week bg-(--color-primary-bg)">
          <Icon name="shield" size={28} />
        </span>
        <h3 className="mt-5 mb-2 text-lg font-semibold">Welcome to Redaction Studio</h3>
        <p className="mx-auto mb-6 max-w-150 text-sm text-text-weak">
          Your studio is getting started. You can manage your profile and Google sign-in in account
          settings.
        </p>
        <Button asChild variant="primary" size="sm">
          <Link to="/account">
            Manage your account
            <Icon name="chevron" size={16} />
          </Link>
        </Button>
      </Card>
    </section>
  )
}
