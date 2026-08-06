import {
  Navigate,
  useLocation,
} from "react-router-dom";

import useAuth from "@/context/useAuth";

export default function ProtectedRoute({
  children,
}) {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  const location =
    useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="mt-4 text-slate-600">
            Checking administrator access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from:
            `${location.pathname}${location.search}`,
        }}
      />
    );
  }

  return children;
}