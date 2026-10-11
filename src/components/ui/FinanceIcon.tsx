
export interface FinanceIconProps {
  name:
    | 'emergency'
    | 'travel'
    | 'education'
    | 'car'
    | 'wealth'
    | 'starting'
    | 'student'
    | 'first-job'
    | 'freelancer'
    | 'professional'
    | 'home'
    | 'explore'
    | 'learn'
    | 'you'
    | 'wallet'
    | 'chart'
    | 'shield'
    | 'target'
    | 'percent';
  size?: number;
  className?: string;
}

export function FinanceIcon({ name, size = 20, className = 'text-ink' }: FinanceIconProps) {
  const s = { width: size, height: size };

  switch (name) {
    // Emergency / Shield
    case 'emergency':
    case 'shield':
      return (
        <svg
          style={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );

    // Travel / Flight / Lifestyle
    case 'travel':
      return (
        <svg
          style={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 20.5 3c-1-1-3-.5-4.5 1L12.5 7.5 4.3 5.7c-.5-.1-.9.1-1.2.4l-.8.8 6.5 4.3-3.6 3.6-2.5-.5c-.3-.1-.7 0-.9.3l-.5.5 3 2 2 3 .5-.5c.3-.3.4-.6.3-.9l-.5-2.5 3.6-3.6 4.3 6.5.8-.8c.3-.3.5-.7.4-1.2z" />
        </svg>
      );

    // Education / Graduation / Knowledge
    case 'education':
    case 'student':
      return (
        <svg
          style={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
        </svg>
      );

    // Car / Vehicle
    case 'car':
      return (
        <svg
          style={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.5l2-4h11l2 4H21a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
          <path d="M5 9h14" />
        </svg>
      );

    // Wealth / Growth / Line Chart
    case 'wealth':
    case 'chart':
      return (
        <svg
          style={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M23 6l-9.5 9.5-5-5L1 18" />
          <path d="M17 6h6v6" />
        </svg>
      );

    // Starting out / Seedling / Sprout / Habit
    case 'starting':
      return (
        <svg
          style={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 22V10" />
          <path d="M12 10a6 6 0 0 1 6-6c0 6-6 6-6 6z" />
          <path d="M12 14a6 6 0 0 0-6-6c0 6 6 6 6 6z" />
        </svg>
      );

    // First job / Briefcase / Career
    case 'first-job':
      return (
        <svg
          style={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <path d="M12 12v2" />
        </svg>
      );

    // Freelancer / Variable Income / Lightning / Independence
    case 'freelancer':
      return (
        <svg
          style={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );

    // Professional / Enterprise / Building / Salaried
    case 'professional':
      return (
        <svg
          style={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
        </svg>
      );

    // Bottom nav: Home
    case 'home':
      return (
        <svg
          style={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );

    // Bottom nav: Explore / Compass
    case 'explore':
      return (
        <svg
          style={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );

    // Bottom nav: Learn / Book
    case 'learn':
      return (
        <svg
          style={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 1-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );

    // Bottom nav: You / Profile / User
    case 'you':
      return (
        <svg
          style={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );

    // Wallet / Funds
    case 'wallet':
      return (
        <svg
          style={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
          <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
        </svg>
      );

    // Target / Goal
    case 'target':
      return (
        <svg
          style={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );

    // Percent / Return rate
    case 'percent':
    default:
      return (
        <svg
          style={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <line x1="19" y1="5" x2="5" y2="19" />
          <circle cx="6.5" cy="6.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
      );
  }
}
