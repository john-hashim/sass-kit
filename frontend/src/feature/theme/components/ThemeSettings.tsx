import { Monitor, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { readTheme, setTheme, type Theme } from '@/feature/theme/theme'

const themes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const

export function ThemeSettings() {
  const [theme, updateTheme] = useState<Theme>(readTheme)

  return (
    <section className="flex flex-wrap items-center gap-4" aria-labelledby="theme-heading">
      <h3 id="theme-heading" className="text-sm font-medium text-text-primary">
        Theme
      </h3>
      <fieldset className="relative grid h-9 w-30 shrink-0 grid-cols-3 rounded-lg border border-[var(--color-border-secondary)] bg-[var(--color-chrome-bg)] p-1">
        <legend className="sr-only">Choose theme</legend>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-md bg-[var(--color-outlet-bg)] transition-transform duration-200 motion-reduce:transition-none"
          style={{
            transform: `translateX(${themes.findIndex(option => option.value === theme) * 100}%)`,
          }}
        />
        {themes.map(({ value, label, icon: Icon }) => (
          <div key={value} className="relative min-w-0">
            <input
              id={`theme-${value}`}
              type="radio"
              name="theme"
              value={value}
              checked={theme === value}
              className="peer sr-only"
              onChange={() => {
                setTheme(value)
                updateTheme(value)
              }}
            />
            <Label
              htmlFor={`theme-${value}`}
              title={label === 'System' ? 'System: follow device settings' : label}
              className="h-full cursor-pointer justify-center rounded-md transition-colors hover:text-text-primary peer-checked:text-text-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-border-primary)]"
            >
              <Icon className="size-4" aria-hidden />
              <span className="sr-only">{label}</span>
            </Label>
          </div>
        ))}
      </fieldset>
    </section>
  )
}
