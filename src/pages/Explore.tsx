import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../state/AppState';
import { RiskMeter } from '../components/ui/RiskMeter';
import { EmptyState } from '../components/ui/EmptyState';
import { BottomNav } from '../components/layout/BottomNav';
import { CATEGORIES } from '../lib/content';
import { computePlan } from '../lib/planEngine';

export default function ExplorePage() {
  const navigate = useNavigate();
  const { state } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');

  const plan = computePlan(state);
  const recommendedCategoryIds = Array.from(
    new Set(plan.buckets.filter(b => b.id !== 'flexible').map(b => b.categoryId))
  );
  const recCategories = CATEGORIES.filter(c => recommendedCategoryIds.includes(c.id));

  const q = searchQuery.trim().toLowerCase();
  const filteredCategories = CATEGORIES.filter(
    c =>
      c.name.toLowerCase().includes(q) ||
      c.whatIs.toLowerCase().includes(q) ||
      c.bestFor.toLowerCase().includes(q) ||
      c.riskLabel.toLowerCase().includes(q)
  );

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen bg-bg">
      <div className="flex-1 px-6 pt-8 pb-24">
        <header className="mb-6">
          <h1 className="font-bold text-[20px] tracking-tight text-ink mb-1">
            Explore Asset Classes
          </h1>
          <p className="text-[13px] text-muted">
            How mutual fund categories work
          </p>
        </header>

        {/* Search */}
        <div className="relative mb-6">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="search"
            placeholder="liquid, index, equity..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface border border-hairline rounded-[var(--radius-card)] text-[14px] text-ink placeholder:text-ghost focus:outline-none focus:border-accent transition-colors"
            aria-label="Search categories"
          />
        </div>

        {/* Recommended for your plan */}
        {!q && recCategories.length > 0 && (
          <section className="mb-6">
            <p className="section-label mb-3">In your plan</p>
            <div className="bg-surface border border-hairline rounded-[var(--radius-card)] overflow-hidden">
              {recCategories.map((cat, i) => (
                <button
                  key={`rec-${cat.id}`}
                  onClick={() => navigate(`/explore/${cat.id}`)}
                  className={`w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-surface-subtle transition-colors cursor-pointer ${
                    i < recCategories.length - 1 ? 'border-b border-hairline-subtle' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-accent-deeper bg-accent-light px-1.5 py-0.5 rounded">
                        PLAN
                      </span>
                      <span className="font-semibold text-[14px] text-ink">{cat.name}</span>
                    </div>
                    <RiskMeter dots={cat.riskDots} label={cat.riskLabel} />
                  </div>
                  <svg className="w-4 h-4 text-ghost shrink-0 ml-3" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* All categories */}
        <section>
          <p className="section-label mb-3">
            {q ? 'Results' : 'All categories'}
          </p>
          {filteredCategories.length > 0 ? (
            <div className="bg-surface border border-hairline rounded-[var(--radius-card)] overflow-hidden">
              {filteredCategories.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/explore/${cat.id}`)}
                  className={`w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-surface-subtle transition-colors cursor-pointer ${
                    i < filteredCategories.length - 1 ? 'border-b border-hairline-subtle' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="font-semibold text-[14px] text-ink mb-0.5">{cat.name}</p>
                    <p className="text-[12px] text-muted truncate mb-1.5">{cat.bestFor}</p>
                    <RiskMeter dots={cat.riskDots} label={cat.riskLabel} />
                  </div>
                  <svg className="w-4 h-4 text-ghost shrink-0" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No categories match"
              description="Try typing debt, liquid, index, or hybrid."
            />
          )}
        </section>

        {/* Learn link */}
        {!q && (
          <button
            onClick={() => navigate('/learn/investing-vs-trading')}
            className="mt-5 w-full flex items-center justify-between px-4 py-3.5 bg-surface border border-hairline rounded-[var(--radius-card)] hover:border-accent/40 transition-colors cursor-pointer text-left"
          >
            <div>
              <p className="font-semibold text-[13px] text-ink">Investing vs. Trading</p>
              <p className="text-[11px] text-muted">Why compounding beats speculation</p>
            </div>
            <svg className="w-4 h-4 text-ghost shrink-0" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
