import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeDark = stored ? stored === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', activeDark);
    setIsDark(activeDark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <Button variant="outline" size="icon" aria-label="Toggle theme" onClick={toggle} className="hover-scale">
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
