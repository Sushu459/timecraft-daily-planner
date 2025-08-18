import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ProfileDropdown } from "./auth/ProfileDropdown";

export default function TimeCraftHeader() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-gradient-primary shadow-elevated flex items-center justify-center">
            <CalendarClock className="text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">TimeCraft</span>
        </Link>
        <nav className="flex items-center gap-2">
          {isAuthenticated && (
            <Link to="/analytics" className="story-link px-3 py-2 rounded-md text-sm">Analytics</Link>
          )}
          <ThemeToggle />
          {isAuthenticated ? (
            <ProfileDropdown />
          ) : (
            <Button variant="hero" onClick={() => navigate('/auth')}>Sign in</Button>
          )}
        </nav>
      </div>
    </header>
  );
}
