import {
  BedDouble,
  CreditCard,
  LogIn,
  Plus,
  UserPlus,
} from "lucide-react";

import QuickAction from "./QuickAction";

const actions = [
  {
    title: "New Booking",
    description: "Create a room or bed booking",
    icon: Plus,
    color: "bg-indigo-600",
  },
  {
    title: "Add Guest",
    description: "Register a new guest",
    icon: UserPlus,
    color: "bg-emerald-600",
  },
  {
    title: "Check In",
    description: "Complete guest check-in",
    icon: LogIn,
    color: "bg-blue-600",
  },
  {
    title: "Receive Payment",
    description: "Record a payment",
    icon: CreditCard,
    color: "bg-amber-500",
  },
  {
    title: "Manage Rooms",
    description: "View room availability",
    icon: BedDouble,
    color: "bg-violet-600",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">
        Quick Actions
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Frequently used operations
      </p>

      <div className="mt-6 space-y-3">
        {actions.map((action) => (
          <QuickAction
            key={action.title}
            {...action}
            onClick={() => console.log(action.title)}
          />
        ))}
      </div>
    </div>
  );
}