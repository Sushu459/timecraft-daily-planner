import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';

export const StreakCounter = () => {
  const streak = useAppStore(state => state.streak);

  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
          <Flame className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Daily Streak</div>
          <div className="text-xl font-bold">{streak} days</div>
        </div>
      </CardContent>
    </Card>
  );
};