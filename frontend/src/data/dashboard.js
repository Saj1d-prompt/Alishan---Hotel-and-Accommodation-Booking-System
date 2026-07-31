import {
  BedDouble,
  CalendarDays,
  CreditCard,
  LogIn,
  Plus,
  UserPlus,
  Users,
} from "lucide-react";

export const dashboardStats = [
  {
    title: "Today's Bookings",
    value: "18",
    subtitle: "+12% from yesterday",
    icon: CalendarDays,
    color: "from-indigo-600 to-violet-600",
  },
  {
    title: "Guests",
    value: "42",
    subtitle: "Currently Staying",
    icon: Users,
    color: "from-emerald-500 to-green-600",
  },
  {
    title: "Available Rooms",
    value: "23",
    subtitle: "Ready for Booking",
    icon: BedDouble,
    color: "from-blue-500 to-cyan-600",
  },
  {
    title: "Today's Revenue",
    value: "€1,450",
    subtitle: "+8% this week",
    icon: CreditCard,
    color: "from-amber-500 to-orange-500",
  },
];

export const quickActions = [
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
];