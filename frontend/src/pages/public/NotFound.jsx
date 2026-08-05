import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-6 pb-20 pt-36">
      <div className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          404
        </p>

        <h1 className="mt-4 text-5xl font-bold text-slate-950">
          Page Not Found
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-600">
          The page you requested does not exist or
          may have been moved.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <ArrowLeft size={18} />
          Return Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;