import { Globe, Timer, Play, AlarmClock } from 'lucide-react';
import { cn } from '@/lib/utils';
import './Navigation.css'
interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'world-clock', icon: Globe, label: 'World Clock' },
    { id: 'timer', icon: Timer, label: 'Timer' },
    { id: 'stopwatch', icon: Play, label: 'Stopwatch' },
    { id: 'alarm', icon: AlarmClock, label: 'Alarm' },
  ];

  return (
    <nav className="nav-bar">
      <div className="flex justify-center max-w-md mx-auto">
        <div className="flex space-x-2 bg-secondary/50 p-2 rounded-2xl backdrop-blur-sm">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex flex-col items-center justify-center px-4 py-3 rounded-xl transition-all duration-300",
                activeTab === id 
                  ? "bg-gradient-primary text-primary-foreground shadow-glow scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
              )}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
export {Navigation}