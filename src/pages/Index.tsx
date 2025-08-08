import { useState } from 'react';
import {Navigation} from '@/components/navigation/Navigation';
import WorldClock from '@/components/worldclock/WorldClock';
import Timer from '@/components/timer/Timer';
import Stopwatch from '@/components/stopwatch/Stopwatch';
import Alarm from '@/components/alarm/Alarm';

const Index = () => {
  const [activeTab, setActiveTab] = useState('world-clock');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'world-clock':
        return <WorldClock />;
      case 'timer':
        return <Timer />;
      case 'stopwatch':
        return <Stopwatch />;
      case 'alarm':
        return <Alarm />;
      default:
        return <WorldClock />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <main className="max-w-md mx-auto">
        {renderActiveTab()}
      </main>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
