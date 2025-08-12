import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  onClick: () => void;
}

export default function QuickAddButton({ onClick }: Props) {
  return (
    <div className="fixed bottom-6 right-6 animate-enter">
      <Button variant="hero" size="lg" onClick={onClick} className="shadow-elevated hover-scale">
        <Plus />
        Add Task
      </Button>
    </div>
  );
}
