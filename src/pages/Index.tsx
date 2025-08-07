import { useState } from 'react';
import Navigation from '@/components/Navigation';
import WorldClock from '@/components/WorldClock';
import Timer from '@/components/Timer';
import Stopwatch from '@/components/Stopwatch';
import Alarm from '@/components/Alarm';

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
