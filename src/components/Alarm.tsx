import { useState, useEffect } from 'react';
import { Plus, Trash2, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface AlarmItem {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  repeat: string[];
}

const Alarm = () => {
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlarm, setNewAlarm] = useState({
    time: '07:00',
    label: 'Wake up',
    repeat: [] as string[],
  });

  const weekDays = [
    { id: 'mon', label: 'M' },
    { id: 'tue', label: 'T' },
    { id: 'wed', label: 'W' },
    { id: 'thu', label: 'T' },
    { id: 'fri', label: 'F' },
    { id: 'sat', label: 'S' },
    { id: 'sun', label: 'S' },
  ];

  // Load alarms from localStorage on component mount
  useEffect(() => {
    const savedAlarms = localStorage.getItem('synchroClock_alarms');
    if (savedAlarms) {
      setAlarms(JSON.parse(savedAlarms));
    }
  }, []);

  // Save alarms to localStorage whenever alarms change
  useEffect(() => {
    localStorage.setItem('synchroClock_alarms', JSON.stringify(alarms));
  }, [alarms]);

  const addAlarm = () => {
    const alarm: AlarmItem = {
      id: Date.now().toString(),
      time: newAlarm.time,
      label: newAlarm.label,
      enabled: true,
      repeat: newAlarm.repeat,
    };
    
    setAlarms(prev => [...prev, alarm]);
    setNewAlarm({ time: '07:00', label: 'Wake up', repeat: [] });
    setShowAddForm(false);
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
  };

  const toggleRepeatDay = (day: string) => {
    setNewAlarm(prev => ({
      ...prev,
      repeat: prev.repeat.includes(day) 
        ? prev.repeat.filter(d => d !== day)
        : [...prev.repeat, day]
    }));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getRepeatText = (repeat: string[]) => {
    if (repeat.length === 0) return 'Once';
    if (repeat.length === 7) return 'Every day';
    if (repeat.length === 5 && !repeat.includes('sat') && !repeat.includes('sun')) return 'Weekdays';
    if (repeat.length === 2 && repeat.includes('sat') && repeat.includes('sun')) return 'Weekends';
    return repeat.map(day => weekDays.find(d => d.id === day)?.label).join(', ');
  };

  return (
    <div className="flex flex-col space-y-6 p-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Alarms</h1>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="rounded-full bg-gradient-primary hover:scale-110 transition-transform"
        >
          <Plus size={20} />
        </Button>
      </div>

      {/* Add Alarm Form */}
      {showAddForm && (
        <div className="feature-card rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Add New Alarm</h3>
          
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={newAlarm.time}
              onChange={(e) => setNewAlarm(prev => ({ ...prev, time: e.target.value }))}
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={newAlarm.label}
              onChange={(e) => setNewAlarm(prev => ({ ...prev, label: e.target.value }))}
              placeholder="Alarm name"
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label>Repeat</Label>
            <div className="flex space-x-2">
              {weekDays.map((day) => (
                <button
                  key={day.id}
                  onClick={() => toggleRepeatDay(day.id)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    newAlarm.repeat.includes(day.id)
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <Button onClick={addAlarm} className="flex-1">
              Add Alarm
            </Button>
            <Button 
              onClick={() => setShowAddForm(false)} 
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Alarms List */}
      <div className="space-y-3">
        {alarms.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <p>No alarms set</p>
            <p className="text-sm">Tap the + button to add your first alarm</p>
          </div>
        ) : (
          alarms.map((alarm) => (
            <div key={alarm.id} className="feature-card rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${alarm.enabled ? 'bg-primary/20' : 'bg-muted'}`}>
                      {alarm.enabled ? 
                        <Bell size={20} className="text-primary" /> : 
                        <BellOff size={20} className="text-muted-foreground" />
                      }
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${alarm.enabled ? 'text-primary' : 'text-muted-foreground'}`}>
                        {formatTime(alarm.time)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {alarm.label} • {getRepeatText(alarm.repeat)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={alarm.enabled}
                    onCheckedChange={() => toggleAlarm(alarm.id)}
                  />
                  <Button
                    onClick={() => deleteAlarm(alarm.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full p-2"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Future Feature Hint */}
      <div className="feature-card rounded-2xl p-4 border-dashed border-2 border-primary/30 bg-primary/5">
        <div className="text-center text-primary">
          <div className="text-lg font-semibold mb-1">🎉 Coming Soon</div>
          <div className="text-sm">Alarm Parties - Sync alarms with friends!</div>
          <div className="text-xs text-muted-foreground mt-1">Connect Supabase to unlock collaborative features</div>
        </div>
      </div>
    </div>
  );
};

export default Alarm;