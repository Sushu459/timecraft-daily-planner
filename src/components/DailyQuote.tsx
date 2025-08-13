import { useDailyQuote } from '@/hooks/useDailyQuote';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

export const DailyQuote = () => {
  const quote = useDailyQuote();

  if (!quote) return null;

  return (
    <Card className="mb-6 bg-gradient-primary text-primary-foreground border-0 shadow-elevated">
      <CardContent className="p-4 flex items-center gap-3">
        <Quote className="h-5 w-5 opacity-80 shrink-0" />
        <p className="text-sm italic font-medium">{quote}</p>
      </CardContent>
    </Card>
  );
};