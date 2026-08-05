import {
  ChevronRight,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";

const Breadcrumb = ({
  location,
  room = null,
  term = null,
}) => {
  const locationUrl = location
    ? `/locations/${location.slug}` +
      (term
        ? `?term=${encodeURIComponent(term)}`
        : "")
    : "/locations";

  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-slate-100"
    >
      <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <li>
            <Link
              to="/"
              className="flex items-center gap-1 transition hover:text-blue-600"
            >
              <Home size={16} />
              Home
            </Link>
          </li>

          <li aria-hidden="true">
            <ChevronRight size={16} />
          </li>

          <li>
            <Link
              to="/locations"
              className="transition hover:text-blue-600"
            >
              Locations
            </Link>
          </li>

          {location ? (
            <>
              <li aria-hidden="true">
                <ChevronRight size={16} />
              </li>

              <li>
                {room ? (
                  <Link
                    to={locationUrl}
                    className="transition hover:text-blue-600"
                  >
                    {location.name}
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className="font-semibold text-slate-900"
                  >
                    {location.name}
                  </span>
                )}
              </li>
            </>
          ) : null}

          {room ? (
            <>
              <li aria-hidden="true">
                <ChevronRight size={16} />
              </li>

              <li>
                <span
                  aria-current="page"
                  className="font-semibold text-slate-900"
                >
                  {room.title}
                </span>
              </li>
            </>
          ) : null}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;