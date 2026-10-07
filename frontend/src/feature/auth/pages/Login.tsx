import { Navigate, useSearchParams } from 'react-router-dom'
import { ENDPOINTS } from '@/api/endpoints'
import { Button } from '@/components/ui/button'
import { AppName } from '@/feature/layout/AppName'
import { Icon } from '@/feature/layout/Icon'
import { useUserStore } from '@/store'
import '../styles/login.css'

export function Login() {
  const { user } = useUserStore()
  const [params] = useSearchParams()
  if (user) return <Navigate to="/files" replace />
  const error = params.get('error')
  return (
    <main className="login-page">
      <section className="login-story">
        <div className="brand">
          <span className="brand-mark">
            <Icon name="shield" />
          </span>
          <AppName />
        </div>
        <div className="story-content">
          <p className="eyebrow">MULTIMEDIA REDACTION STUDIO</p>
          <h1>
            Keep the story.
            <br />
            <span>Protect the details.</span>
          </h1>
          <p>A focused workspace for your multimedia redaction workflow.</p>
          <div className="redaction-preview" aria-hidden="true">
            <div className="preview-top">
              <span className="preview-dot" />A little privacy goes a long way
              <span className="preview-tag">REDACTED</span>
            </div>
            <div className="preview-document">
              <span>Project notes</span>
              <div className="document-line" />
              <div className="document-row">
                <i />
                <b />
                <i />
              </div>
              <div className="document-line short" />
              <div className="document-row">
                <b />
                <i />
              </div>
            </div>
            <div className="preview-footer">
              <Icon name="shield" size={16} />
              Sensitive details, kept out of sight.
            </div>
          </div>
        </div>
        <p className="story-bottom">Less exposure. More peace of mind.</p>
      </section>
      <section className="login-form-panel">
        <div className="login-card">
          <span className="login-symbol">
            <Icon name="shield" size={28} />
          </span>
          <p className="eyebrow">YOUR WORKSPACE AWAITS</p>
          <h2>Welcome to the studio</h2>
          <p className="text-text-secondary login-description">
            Sign in to your account to get started.
          </p>
          {error && (
            <p
              role="alert"
              className="rounded-md border border-[var(--color-border-secondary)] bg-background p-3 text-sm text-error mb-6"
            >
              {error === 'not_configured'
                ? 'Google sign-in is currently unavailable. Please contact your administrator.'
                : 'Google sign-in failed or was cancelled. Please try again.'}
            </p>
          )}
          <Button asChild variant="secondary" size="sm" className="w-full gap-3">
            <a className="group" href={ENDPOINTS.AUTH.GOOGLE}>
              <svg
                className="text-current"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M21.6 12.2c0-.7-.1-1.4-.2-2.2H12v4.2h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.3 3-7.5Z"
                />
                <path
                  fill="currentColor"
                  d="M12 22c2.7 0 5-.9 6.6-2.3l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"
                />
                <path
                  fill="currentColor"
                  d="M6.4 14.1a6 6 0 0 1 0-4.2V7.3H3.1a10 10 0 0 0 0 9.4Z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.8c1.5 0 2.8.5 3.9 1.5L18.8 4A10 10 0 0 0 3.1 7.3l3.3 2.6C7.2 7.6 9.4 5.8 12 5.8Z"
                />
              </svg>
              Continue with Google
              <Icon name="chevron" size={16} />
            </a>
          </Button>
          <div className="login-divider" />
          <p className="login-note">
            <Icon name="shield" size={16} />
            Google sign-in. No extra password to remember.
          </p>
        </div>
        <p className="login-footer">
          <AppName />
        </p>
      </section>
    </main>
  )
}
