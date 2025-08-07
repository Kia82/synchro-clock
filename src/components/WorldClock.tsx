import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

interface TimeZone {
  name: string;
  city: string;
  timezone: string;
  flag: string;
}

const WorldClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  const timeZones: TimeZone[] = [
    { name: 'Local Time', city: 'Your Location', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, flag: '📍' },
    { name: 'New York', city: 'United States', timezone: 'America/New_York', flag: '🇺🇸' },
    { name: 'London', city: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧' },
    { name: 'Tokyo', city: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
    { name: 'Sydney', city: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺' },
    { name: 'Dubai', city: 'UAE', timezone: 'Asia/Dubai', flag: '🇦🇪' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(currentTime);
  };

  const formatDate = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(currentTime);
  };

  const mainTimeZone = timeZones[0];

  return (
    <div className="flex flex-col space-y-6 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-center space-x-2 text-primary">
        <Globe size={24} />
        <h1 className="text-2xl font-bold">SynchroClock</h1>
      </div>

      {/* Main Clock */}
      <div className="digital-time rounded-3xl p-8 text-center">
        <div className="text-6xl font-mono font-bold text-primary mb-2 animate-pulse-glow">
          {formatTime(mainTimeZone.timezone)}
        </div>
        <div className="text-lg text-muted-foreground">
          {formatDate(mainTimeZone.timezone)}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {mainTimeZone.name}
        </div>
      </div>

      {/* World Clocks */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Globe size={18} className="mr-2" />
          World Times
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {timeZones.slice(1).map((tz) => (
            <div key={tz.timezone} className="feature-card rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{tz.flag}</span>
                  <div>
                    <div className="font-semibold text-foreground">{tz.name}</div>
                    <div className="text-sm text-muted-foreground">{tz.city}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono font-bold text-primary">
                    {formatTime(tz.timezone)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(tz.timezone)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorldClock;