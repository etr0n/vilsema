export type FilterTab = {
  key: string;
  label: string;
  active: boolean;
  onSelect: () => void;
};

export function FilterTabs({ label, tabs }: { label: string; tabs: FilterTab[] }) {
  return (
    <div className="no-scrollbar mb-14 flex overflow-x-auto sm:justify-center">
      <div role="tablist" aria-label={label} className="flex shrink-0 border-b border-hero-foreground/30">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={t.active}
            onClick={t.onSelect}
            className={`-mb-px w-44 shrink-0 border-b-2 py-5 text-center text-[13px] font-medium uppercase tracking-[0.14em] transition-colors ${
              t.active
                ? "border-hero-foreground text-hero-foreground"
                : "border-transparent text-hero-foreground/75 hover:text-hero-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
