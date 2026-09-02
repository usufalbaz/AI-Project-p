import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 ${
        isDark
          ? 'bg-[#151622] hover:bg-[#1E2032] text-amber-300 border-white/[0.1] hover:border-amber-400/40 shadow-sm'
          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
      title={isDark ? 'التبديل إلى الوضع الفاتح (الأكاديمي)' : 'التبديل إلى الوضع الداكن (مختبر الأبحاث)'}
      aria-label="تبديل مظهر الموقع"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-3.5 h-3.5 text-amber-400 transition-transform duration-300 rotate-0" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-indigo-600 transition-transform duration-300 -rotate-12" />
        )}
      </div>

      {!compact && (
        <span className="hidden sm:inline text-[11px]">
          {isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
        </span>
      )}
    </button>
  );
};
