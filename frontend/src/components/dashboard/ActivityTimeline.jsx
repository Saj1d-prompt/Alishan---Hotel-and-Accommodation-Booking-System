import {
  BadgeCheck,
  CreditCard,
  LogIn,
  UserPlus,
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "John Smith checked in",
    time: "09:20 AM",
    icon: LogIn,
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Payment received (€450)",
    time: "10:05 AM",
    icon: CreditCard,
    color: "bg-emerald-500",
  },
  {
    id: 3,
    title: "Maria Garcia registered",
    time: "11:15 AM",
    icon: UserPlus,
    color: "bg-indigo-500",
  },
  {
    id: 4,
    title: "Booking approved",
    time: "12:40 PM",
    icon: BadgeCheck,
    color: "bg-amber-500",
  },
];

export default function ActivityTimeline() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-bold text-slate-900">
        Recent Activity
      </h2>

      <div className="space-y-6">

        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="flex gap-4"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${activity.color}`}
              >
                <Icon size={18} />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-slate-800">
                  {activity.title}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}