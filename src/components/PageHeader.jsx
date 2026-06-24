import React from "react";

// Section header used by every secondary page.
// Editorial maroon left-rule + section heading style per BFSI guidelines.
export default function PageHeader({ eyebrow, title, lede, action }) {
  return (
    <header className="px-6 lg:px-10 pt-9 pb-7 border-b border-surface-divider">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-9">
          <div className="flex items-center gap-3 cap-label">
            <span className="w-6 h-px bg-maroon inline-block" />
            {eyebrow}
          </div>
          <h1 className="serif text-[36px] lg:text-[42px] leading-[1.08] text-ink-900 mt-3">
            {title}
          </h1>
          {lede && (
            <p className="text-ink-500 max-w-2xl mt-3 text-[14px] leading-[1.6]">{lede}</p>
          )}
        </div>
        {action && <div className="lg:col-span-3 lg:text-right">{action}</div>}
      </div>
    </header>
  );
}
