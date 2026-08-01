import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ location }) => {
  return (
    <section className="bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">

          <Link
            to="/"
            className="flex items-center gap-1 hover:text-blue-600"
          >
            <Home size={16} />
            Home
          </Link>

          <ChevronRight size={16} />

          <Link
            to="/locations"
            className="hover:text-blue-600"
          >
            Locations
          </Link>

          <ChevronRight size={16} />

          <span className="font-semibold text-slate-900">
            {location?.name}
          </span>

        </div>
      </div>
    </section>
  );
};

export default Breadcrumb;