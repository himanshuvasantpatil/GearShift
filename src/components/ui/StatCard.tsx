import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: 'orange' | 'emerald' | 'blue' | 'purple' | 'amber';
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'orange',
  className,
  onClick
}) => {
  const accentGlow = {
    orange: 'hover:border-orange-500/50 hover:shadow-orange-950/30',
    emerald: 'hover:border-emerald-500/50 hover:shadow-emerald-950/30',
    blue: 'hover:border-blue-500/50 hover:shadow-blue-950/30',
    purple: 'hover:border-purple-500/50 hover:shadow-purple-950/30',
    amber: 'hover:border-amber-500/50 hover:shadow-amber-950/30'
  }[accentColor];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={cn(
        'bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4.5 space-y-2.5 shadow-lg transition-all',
        accentGlow,
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium">{title}</span>
        {icon && <div className="text-slate-400 shrink-0">{icon}</div>}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
          {value}
        </div>
        {trend && (
          <span
            className={cn(
              'text-xs font-mono font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border',
              trend.isPositive !== false
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                : 'bg-red-950/80 text-red-300 border-red-800/80'
            )}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
          {subtitle}
        </div>
      )}
    </motion.div>
  );
};
