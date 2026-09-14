export function Card({ title, description, children, className = '' }) {
  return (
    <section className={`rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-[var(--shadow-card)] ${className}`}>
      {title && (
        <header className="mb-4">
          <h2 className="text-base font-semibold text-[var(--color-foreground)]">{title}</h2>
          {description && <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{description}</p>}
        </header>
      )}
      {children}
    </section>
  )
}

export function Field({ label, hint, children }) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-semibold text-[var(--color-foreground)]">{label}</p>
        {hint && <p className="text-xs text-[var(--color-muted-foreground)]">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

export function OptionGrid({ options, value, onChange, columns = 4 }) {
  return (
    <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
              selected
                ? 'border-[var(--color-primary)] bg-[var(--color-accent)] shadow-[var(--shadow-soft)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/40'
            }`}
          >
            <span className="block text-sm font-semibold text-[var(--color-foreground)]">{option.label}</span>
            {option.sub && <span className="block text-xs text-[var(--color-muted-foreground)]">{option.sub}</span>}
          </button>
        )
      })}
    </div>
  )
}
