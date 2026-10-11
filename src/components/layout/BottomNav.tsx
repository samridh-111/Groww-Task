import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/home', label: 'Home' },
  { path: '/explore', label: 'Explore' },
  { path: '/learn', label: 'Learn' },
  { path: '/you', label: 'You' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/home') {
      return (
        location.pathname === '/home' ||
        location.pathname === '/plan' ||
        location.pathname === '/plan/why' ||
        location.pathname === '/scenario' ||
        location.pathname.startsWith('/invest')
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="sticky bottom-0 bg-surface/95 backdrop-blur-md border-t border-hairline safe-bottom z-30"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around py-3 px-4 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ path, label }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`relative px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 select-none cursor-pointer ${
                active ? 'text-accent font-bold' : 'text-muted hover:text-ink'
              }`}
              aria-current={active ? 'page' : undefined}
              aria-label={label}
            >
              <span>{label}</span>
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
