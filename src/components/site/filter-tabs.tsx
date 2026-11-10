export type FilterTab = {
  key: string;
  label: string;
  active: boolean;
  onSelect: () => void;
};

export function FilterTabs({ label, tabs }: { label: string; tabs: FilterTab[] }) {
  return (
    <div className="no-scrollbar mb-14 flex overflow-x-auto sm:justify-center">
      <div role="tablist" aria-label={label} className="flex shrink-0 border-b border-page-hero-text/40">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={t.active}
            onClick={t.onSelect}
            className={`-mb-px w-44 shrink-0 border-b-2 py-5 text-center text-[15px] uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-page-hero-text ${
              t.active
                ? "border-page-hero-text font-medium text-page-hero-text"
                : "border-transparent font-normal text-ink-2 hover:text-link-hover"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
