import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Timer = () => {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSettingTime, setIsSettingTime] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsSettingTime(true);
            // Timer completed - you could add notification here
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    if (isSettingTime) {
      const totalSeconds = minutes * 60 + seconds;
      setTimeLeft(totalSeconds);
      setIsSettingTime(false);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsSettingTime(true);
    setTimeLeft(0);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustMinutes = (delta: number) => {
    setMinutes(Math.max(0, Math.min(59, minutes + delta)));
  };

  const adjustSeconds = (delta: number) => {
    setSeconds(Math.max(0, Math.min(59, seconds + delta)));
  };

  const progress = isSettingTime ? 0 : ((minutes * 60 + seconds - timeLeft) / (minutes * 60 + seconds)) * 100;

  return (
    <div className="flex flex-col items-center space-y-8 p-6 pb-24">
      <h1 className="text-2xl font-bold text-primary">Timer</h1>

      {/* Timer Display */}
      <div className="relative">
        <div className="digital-time rounded-full w-80 h-80 flex items-center justify-center">
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeDasharray={`${progress * 2.827} 282.7`}
              className="transition-all duration-1000 ease-out"
              style={{ filter: 'drop-shadow(0 0 10px hsl(var(--primary) / 0.5))' }}
            />
          </svg>
          
          {/* Time Display */}
          <div className="text-center z-10">
            <div className="text-4xl font-mono font-bold text-primary">
              {isSettingTime ? formatTime(minutes * 60 + seconds) : formatTime(timeLeft)}
            </div>
            {timeLeft === 0 && !isSettingTime && (
              <div className="text-warning animate-pulse mt-2">Time's Up!</div>
            )}
          </div>
        </div>
      </div>

      {/* Time Settings */}
      {isSettingTime && (
        <div className="flex space-x-8">
          {/* Minutes */}
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Minutes</div>
            <div className="flex flex-col items-center space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => adjustMinutes(1)}
                className="rounded-full w-10 h-10 p-0"
              >
                <Plus size={16} />
              </Button>
              <div className="feature-card rounded-xl px-4 py-2 min-w-[60px] text-center">
                <span className="text-xl font-bold">{minutes.toString().padStart(2, '0')}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => adjustMinutes(-1)}
                className="rounded-full w-10 h-10 p-0"
              >
                <Minus size={16} />
              </Button>
            </div>
          </div>

          {/* Seconds */}
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Seconds</div>
            <div className="flex flex-col items-center space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => adjustSeconds(1)}
                className="rounded-full w-10 h-10 p-0"
              >
                <Plus size={16} />
              </Button>
              <div className="feature-card rounded-xl px-4 py-2 min-w-[60px] text-center">
                <span className="text-xl font-bold">{seconds.toString().padStart(2, '0')}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => adjustSeconds(-1)}
                className="rounded-full w-10 h-10 p-0"
              >
                <Minus size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex space-x-4">
        {isSettingTime || !isRunning ? (
          <Button 
            onClick={startTimer} 
            className="rounded-full w-16 h-16 p-0 bg-gradient-primary hover:scale-110 transition-transform"
            disabled={isSettingTime && minutes === 0 && seconds === 0}
          >
            <Play size={24} />
          </Button>
        ) : (
          <Button 
            onClick={pauseTimer} 
            variant="secondary"
            className="rounded-full w-16 h-16 p-0 hover:scale-110 transition-transform"
          >
            <Pause size={24} />
          </Button>
        )}
        
        <Button 
          onClick={resetTimer} 
          variant="outline"
          className="rounded-full w-16 h-16 p-0 hover:scale-110 transition-transform"
        >
          <RotateCcw size={24} />
        </Button>
      </div>
    </div>
  );
};

export default Timer;