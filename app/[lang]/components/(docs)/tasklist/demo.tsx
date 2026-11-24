"use client";

import { useI18n } from "@/components/i18n/I18nProvider";
import { TaskList } from "@/components/ui/task-list";
import { format } from "@/lib/i18n/format";

const TASKS = [
  { id: "ship", done: true },
  { id: "preview" },
  { id: "star" },
] as const;

export default function TaskListPage() {
  const { m } = useI18n();
  const t = m.demos.tasklist;
  const tasks = TASKS.map((task) => ({ ...task, label: t.tasks[task.id] }));

  return (
    <div className="flex h-full items-center justify-center p-6">
      <TaskList
        defaultTasks={tasks}
        labels={{
          completed: (label) => format(t.completed, { label }),
          reopened: (label) => format(t.reopened, { label }),
        }}
      />
    </div>
  );
}
