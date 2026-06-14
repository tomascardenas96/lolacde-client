import type { RecentActivityItem } from "../types/dashboard.types";

const dotColorMap = {
  accent: "bg-accent",
  muted: "bg-muted",
  success: "bg-success",
  warning: "bg-warning",
};

export const RecentActivity = ({ items }: { items: RecentActivityItem[] }) => {
  return (
    <div className="bg-card p-6 rounded-sm h-full">
      <h3 className="text-[0.65rem] tracking-[0.2em] text-muted uppercase mb-6">
        Actividad reciente
      </h3>
      <div className="flex flex-col gap-5">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <span
              className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                dotColorMap[item.dotColor]
              }`}
            />
            <div>
              <p className="text-sm text-white font-medium">{item.title}</p>
              <p className="text-xs text-muted mt-0.5">{item.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
