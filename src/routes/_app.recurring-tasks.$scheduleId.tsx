import { createFileRoute } from "@tanstack/react-router";

import { RecurringTaskDetailPage } from "@/features/recurring-tasks/components/RecurringTaskDetailPage";

const ScheduleDetailRoute = () => {
  const { scheduleId } = Route.useParams();
  return <RecurringTaskDetailPage scheduleId={scheduleId} />;
};

export const Route = createFileRoute("/_app/recurring-tasks/$scheduleId")({
  component: ScheduleDetailRoute,
});
