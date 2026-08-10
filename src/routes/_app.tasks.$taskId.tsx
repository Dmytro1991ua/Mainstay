import { createFileRoute } from "@tanstack/react-router";

import { TaskDetailPage } from "@/features/tasks/components/TaskDetailPage";

const TaskDetailRoute = () => {
  const { taskId } = Route.useParams();
  return <TaskDetailPage taskId={taskId} />;
};

export const Route = createFileRoute("/_app/tasks/$taskId")({
  component: TaskDetailRoute,
});
