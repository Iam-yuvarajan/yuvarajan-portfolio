'use client';

import { useEffect, useState } from 'react';
import { profile } from '@/data/content';

export default function Clock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: profile.tzName,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <time className="clock" suppressHydrationWarning>
      {now ?? '--:--:--'} {profile.timezoneShort}
    </time>
  );
}
