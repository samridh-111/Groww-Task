import React, { useState, useCallback, useEffect } from 'react';
import { formatCurrency } from '../../lib/content';

interface NumberInputProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  prefix?: string;
  helper?: string;
  error?: string;
  className?: string;
  id?: string;
}

export function NumberInput({
  value,
  onChange,
  min: _min = 0,
  max: _max = 10000000,
  step: _step = 100,
  label,
  prefix = '₹',
  helper,
  error,
  className = '',
  id,
}: NumberInputProps) {
  const [rawValue, setRawValue] = useState(
    value ? new Intl.NumberFormat('en-IN').format(value) : ''
  );

  useEffect(() => {
    setRawValue(value ? new Intl.NumberFormat('en-IN').format(value) : '');
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      if (raw === '') {
        setRawValue('');
        onChange(0);
        return;
      }
      const num = parseInt(raw, 10);
      if (!isNaN(num)) {
        setRawValue(new Intl.NumberFormat('en-IN').format(num));
        onChange(num);
      }
    },
    [onChange]
  );

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <span className="absolute left-4 text-ink font-semibold text-2xl select-none">
          {prefix}
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={rawValue}
          onChange={handleChange}
          placeholder="0"
          className={`w-full pl-11 pr-4 py-3.5 text-3xl font-heading font-bold text-ink bg-surface border rounded-2xl transition-all duration-150 tabular-nums focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 ${
            error ? 'border-caution ring-2 ring-caution/10' : 'border-hairline shadow-2xs'
          }`}
          aria-describedby={
            error ? `${id}-error` : helper ? `${id}-helper` : undefined
          }
          aria-invalid={!!error}
        />
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className="text-caution text-xs font-medium mt-2"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
      {helper && !error && (
        <p id={`${id}-helper`} className="text-muted text-xs mt-2">
          {helper}
        </p>
      )}
    </div>
  );
}

interface AmountStepperProps {
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
  quickChips?: number[];
}

export function AmountStepper({
  value,
  onChange,
  min,
  max,
  step,
  quickChips = [],
}: AmountStepperProps) {
  const decrease = () => onChange(Math.max(min, value - step));
  const increase = () => onChange(Math.min(max, value + step));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-surface border border-hairline rounded-2xl p-3">
        <button
          type="button"
          onClick={decrease}
          disabled={value <= min}
          className="w-11 h-11 rounded-full bg-surface-subtle text-ink flex items-center justify-center text-xl font-bold disabled:opacity-30 cursor-pointer hover:bg-hairline active:scale-95 transition-all select-none"
          aria-label="Decrease amount"
        >
          −
        </button>
        <div className="text-center">
          <span className="font-heading font-bold text-3xl text-ink tabular-nums tracking-tight">
            {formatCurrency(value)}
          </span>
        </div>
        <button
          type="button"
          onClick={increase}
          disabled={value >= max}
          className="w-11 h-11 rounded-full bg-accent-light text-accent-dark flex items-center justify-center text-xl font-bold disabled:opacity-30 cursor-pointer hover:bg-accent/20 active:scale-95 transition-all select-none"
          aria-label="Increase amount"
        >
          +
        </button>
      </div>

      {quickChips.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {quickChips.map(amt => (
            <button
              key={amt}
              type="button"
              onClick={() => onChange(Math.min(max, amt))}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none active:scale-95 tabular-nums ${
                value === amt
                  ? 'bg-ink text-white shadow-xs'
                  : 'bg-surface border border-hairline text-ink hover:bg-surface-subtle'
              }`}
            >
              {formatCurrency(amt)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
