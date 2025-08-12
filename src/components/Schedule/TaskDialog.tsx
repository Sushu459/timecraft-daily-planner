import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useScheduleStore, Category, Recurrence } from "@/store/useScheduleStore";
import { format } from "date-fns";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  date: Date;
}

export default function TaskDialog({ open, onOpenChange, date }: Props) {
  const addTask = useScheduleStore(s => s.addTask);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>('Work');
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("09:00");
  const [duration, setDuration] = useState(60);
  const [recurrence, setRecurrence] = useState<Recurrence>('none');

  const save = () => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const endMinutes = duration + timeToMinutes(start);
    const end = minutesToTime(endMinutes);
    addTask({ title, category, description, date: dateStr, start, end, duration, completed: false, recurrence });
    onOpenChange(false);
    setTitle(""); setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>Plan your next time block</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Deep work" />
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['Work','Health','Learning','Personal','Deep Work'].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-2">
              <Label>Start</Label>
              <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="grid gap-2 col-span-2">
              <Label>Duration (minutes)</Label>
              <Input type="number" min={15} step={15} value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Repeat</Label>
            <Select value={recurrence} onValueChange={(v) => setRecurrence(v as Recurrence)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['none','daily','weekly','monthly'].map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button variant="hero" onClick={save}>Save Task</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function timeToMinutes(t: string) {
  const [h,m] = t.split(':').map(Number);
  return h*60+m;
}
function minutesToTime(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}
