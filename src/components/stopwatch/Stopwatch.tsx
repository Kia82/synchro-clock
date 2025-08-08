import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Lap {
  id: number;
  time: number;
  lapTime: number;
}

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastLapTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    lastLapTimeRef.current = 0;
  };

  const addLap = () => {
    const lapTime = time - lastLapTimeRef.current;
    const newLap: Lap = {
      id: laps.length + 1,
      time: time,
      lapTime: lapTime,
    };
    setLaps((prev) => [newLap, ...prev]);
    lastLapTimeRef.current = time;
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const findFastestLap = () => {
    if (laps.length === 0) return null;
    return Math.min(...laps.map(lap => lap.lapTime));
  };

  const findSlowestLap = () => {
    if (laps.length === 0) return null;
    return Math.max(...laps.map(lap => lap.lapTime));
  };

  const fastestLapTime = findFastestLap();
  const slowestLapTime = findSlowestLap();

  return (
    <div className="flex flex-col items-center space-y-6 p-6 pb-24">
      <h1 className="text-2xl font-bold text-primary">Stopwatch</h1>

      {/* Stopwatch Display */}
      <div className="digital-time rounded-3xl p-8 text-center">
        <div className="text-6xl font-mono font-bold text-primary">
          {formatTime(time)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex space-x-4">
        {!isRunning ? (
          <Button 
            onClick={start} 
            className="rounded-full w-16 h-16 p-0 bg-gradient-primary hover:scale-110 transition-transform"
          >
            <Play size={24} />
          </Button>
        ) : (
          <Button 
            onClick={pause} 
            variant="secondary"
            className="rounded-full w-16 h-16 p-0 hover:scale-110 transition-transform"
          >
            <Pause size={24} />
          </Button>
        )}
        
        <Button 
          onClick={isRunning ? addLap : reset} 
          variant="outline"
          className="rounded-full w-16 h-16 p-0 hover:scale-110 transition-transform"
        >
          {isRunning ? <Flag size={24} /> : <RotateCcw size={24} />}
        </Button>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="w-full max-w-md space-y-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center">
            <Flag size={18} className="mr-2" />
            Laps
          </h2>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {laps.map((lap) => {
              const isFastest = lap.lapTime === fastestLapTime && laps.length > 1;
              const isSlowest = lap.lapTime === slowestLapTime && laps.length > 1;
              
              return (
                <div 
                  key={lap.id} 
                  className={`feature-card rounded-xl p-3 ${
                    isFastest ? 'border-success/50 bg-success/5' : 
                    isSlowest ? 'border-destructive/50 bg-destructive/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`font-bold text-lg ${
                        isFastest ? 'text-success' : 
                        isSlowest ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        #{lap.id}
                      </span>
                      {isFastest && <span className="text-xs text-success">Fastest</span>}
                      {isSlowest && <span className="text-xs text-destructive">Slowest</span>}
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-primary">
                        {formatTime(lap.lapTime)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(lap.time)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stopwatch;