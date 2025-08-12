import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { useMemo } from "react";
import { useScheduleStore, TaskItem } from "@/store/useScheduleStore";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Props {
  dateStr: string;
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6 -> 21

export default function ScheduleGrid({ dateStr }: Props) {
  const tasks = useScheduleStore(s => s.tasksForDate(dateStr));
  const updateTask = useScheduleStore(s => s.updateTask);
  const toggleComplete = useScheduleStore(s => s.toggleComplete);

  const hourMap = useMemo(() => {
    const map: Record<number, TaskItem[]> = {} as any;
    for (const h of HOURS) map[h] = [];
    tasks.forEach(t => {
      const h = parseInt(t.start.split(':')[0], 10);
      if (map[h]) map[h].push(t);
    });
    return map;
  }, [tasks]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const overId = String(over.id);
    if (overId.startsWith('hour-')) {
      const hour = parseInt(overId.split('-')[1], 10);
      const id = String(active.id);
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      const [_, m] = task.start.split(':').map(Number);
      const start = `${String(hour).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      const endMinutes = timeToMinutes(start) + task.duration;
      const end = minutesToTime(endMinutes);
      updateTask(id, { start, end });
    }
  };

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-[80px_1fr] gap-x-4">
        <div className="flex flex-col">
          {HOURS.map(h => (
            <div key={h} className="h-20 text-sm text-muted-foreground flex items-start justify-end pr-1 pt-2">
              {String(h).padStart(2,'0')}:00
            </div>
          ))}
        </div>
        <div className="border-l">
          {HOURS.map(h => (
            <HourRow key={h} hour={h} tasks={hourMap[h]} onToggle={toggleComplete} />
          ))}
        </div>
      </div>
    </DndContext>
  );
}

function HourRow({ hour, tasks, onToggle }: { hour: number; tasks: TaskItem[]; onToggle: (id: string) => void; }) {
  return (
    <div id={`hour-${hour}`} className="h-20 border-b relative" data-droppable>
      <div className="absolute inset-0 p-2 flex gap-2 overflow-x-auto items-start">
        {tasks.map(t => (
          <TaskCard key={t.id} task={t} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, onToggle }: { task: TaskItem; onToggle: (id: string) => void; }) {
  const color = categoryToColor(task.category);
  return (
    <Card id={task.id} className={cn("px-3 py-2 min-w-[180px] select-none hover-scale cursor-grab", color)}>
      <div className="flex items-center gap-2">
        <Checkbox checked={task.completed} onCheckedChange={() => onToggle(task.id)} />
        <div className="text-sm font-medium truncate">{task.title}</div>
      </div>
      <div className="text-xs text-muted-foreground mt-1">{task.start} - {task.end}</div>
    </Card>
  );
}

function categoryToColor(cat: TaskItem['category']) {
  switch (cat) {
    case 'Work': return 'bg-[hsl(var(--cat-work)/0.12)] border-[hsl(var(--cat-work))]';
    case 'Health': return 'bg-[hsl(var(--cat-health)/0.12)] border-[hsl(var(--cat-health))]';
    case 'Learning': return 'bg-[hsl(var(--cat-learning)/0.12)] border-[hsl(var(--cat-learning))]';
    case 'Personal': return 'bg-[hsl(var(--cat-personal)/0.12)] border-[hsl(var(--cat-personal))]';
    case 'Deep Work': return 'bg-[hsl(var(--cat-deep)/0.12)] border-[hsl(var(--cat-deep))]';
  }
}

function timeToMinutes(t: string) { const [h,m] = t.split(':').map(Number); return h*60+m; }
function minutesToTime(mins: number) { const h = Math.floor(mins/60); const m = mins%60; return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`; }
