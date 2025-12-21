import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trash2, GripVertical } from "lucide-react";
import { format } from "date-fns";

interface DraggableEventProps {
  event: {
    id: string;
    title: string;
    due_date: string | null;
    description: string | null;
  };
  type: "study" | "exam" | "break" | "deadline";
  typeConfig: {
    icon: React.ReactNode;
    color: string;
  };
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, eventId: string) => void;
  draggable?: boolean;
}

export function DraggableEvent({
  event,
  type,
  typeConfig,
  onDelete,
  onDragStart,
  draggable = true,
}: DraggableEventProps) {
  const duration = useMemo(() => {
    const match = event.description?.match(/(\d+)\s*min/);
    return match ? `${match[1]} min` : "";
  }, [event.description]);

  return (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      draggable={draggable}
      onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, event.id)}
      className={`group flex items-start gap-2 p-3 rounded-lg border transition-colors cursor-grab active:cursor-grabbing ${typeConfig.color}`}
    >
      {draggable && (
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
      )}
      <div className="mt-0.5 shrink-0">{typeConfig.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{event.title}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          {event.due_date && (
            <span>{format(new Date(event.due_date), "h:mm a")}</span>
          )}
          {duration && (
            <>
              <span>•</span>
              <span>{duration}</span>
            </>
          )}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(event.id);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded shrink-0"
      >
        <Trash2 className="h-3 w-3 text-destructive" />
      </button>
    </motion.div>
  );
}
