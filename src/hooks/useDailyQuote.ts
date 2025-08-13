import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

const QUOTES_API = 'https://api.quotable.io/random?tags=motivational';

export const useDailyQuote = () => {
  const { dailyQuote, setDailyQuote } = useAppStore();

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch(QUOTES_API);
        const data = await response.json();
        setDailyQuote(`"${data.content}" - ${data.author}`);
      } catch (error) {
        setDailyQuote('"The best time to plant a tree was 20 years ago. The second best time is now." - Chinese Proverb');
      }
    };

    if (!dailyQuote) {
      fetchQuote();
    }
  }, [dailyQuote, setDailyQuote]);

  return dailyQuote;
};