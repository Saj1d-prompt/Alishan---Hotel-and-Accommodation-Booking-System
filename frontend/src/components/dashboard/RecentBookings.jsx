import {
  BadgeCheck,
  Clock3,
} from "lucide-react";

const bookings = [
  {
    id: "BK-1001",
    guest: "John Smith",
    room: "Room 302",
    property: "Pylimo",
    status: "Checked In",
  },
  {
    id: "BK-1002",
    guest: "Maria Garcia",
    room: "Bed A12",
    property: "Seskines",
    status: "Pending",
  },
  {
    id: "BK-1003",
    guest: "David Wilson",
    room: "Room 205",
    property: "Latgaliu",
    status: "Checked In",
  },
  {
    id: "BK-1004",
    guest: "Ahmed Khan",
    room: "Room 101",
    property: "Pylimo",
    status: "Pending",
  },
];

export default function RecentBookings() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-bold">
          Recent Bookings
        </h2>

        <button className="text-sm font-medium text-indigo-600 hover:underline">
          View All
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="py-3 text-left text-sm font-semibold">
                Guest
              </th>

              <th className="text-left text-sm font-semibold">
                Property
              </th>

              <th className="text-left text-sm font-semibold">
                Room
              </th>

              <th className="text-left text-sm font-semibold">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {bookings.map((booking) => (

              <tr
                key={booking.id}
                className="border-b hover:bg-slate-50"
              >

                <td className="py-4">

                  <p className="font-medium">
                    {booking.guest}
                  </p>

                  <p className="text-sm text-slate-500">
                    {booking.id}
                  </p>

                </td>

                <td>{booking.property}</td>

                <td>{booking.room}</td>

                <td>

                  {booking.status === "Checked In" ? (

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">

                      <BadgeCheck size={14} />

                      Checked In

                    </span>

                  ) : (

                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">

                      <Clock3 size={14} />

                      Pending

                    </span>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}