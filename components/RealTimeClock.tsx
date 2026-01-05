
import React, { useState, useEffect } from 'react';

const RealTimeClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-mono text-xs md:text-sm font-semibold text-slate-500 bg-slate-100/50 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
      {time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
  );
};

export default RealTimeClock;
