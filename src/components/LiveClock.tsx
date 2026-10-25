import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface LiveClockProps {
  className?: string;
  showIcon?: boolean;
}

export const LiveClock: React.FC<LiveClockProps> = ({ className = '', showIcon = true }) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-mono text-xs tabular-nums text-slate-400 ${className}`}
      title="Live Real-Time System Clock"
    >
      {showIcon && <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
      <span className="text-slate-300 font-medium">{formattedDate}</span>
      <span className="text-slate-600">·</span>
      <span className="text-indigo-400 font-bold">{formattedTime}</span>
    </div>
  );
};
