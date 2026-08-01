import { Search, ArrowUpDown } from "lucide-react";

const LocationFilters = () => {
  return (
    <section className="-mt-10 relative z-20 mb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">

          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">

            {/* Search */}

            <div className="relative">
              <Search
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search by location name..."
                className="h-12 w-full rounded-xl border border-slate-200 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Sort */}

            <div className="relative">
              <ArrowUpDown
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                className="h-12 w-full rounded-xl border border-slate-200 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option>Sort By</option>
                <option>Price: Low → High</option>
                <option>Price: High → Low</option>
                <option>A → Z</option>
                <option>Z → A</option>
              </select>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default LocationFilters;