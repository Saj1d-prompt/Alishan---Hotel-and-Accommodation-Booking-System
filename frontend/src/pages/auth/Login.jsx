import {
  AlertCircle,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import {
  useState,
} from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import useAuth from "@/context/useAuth";

export default function Login() {
  const {
    login,
    isAuthenticated,
    isLoading,
  } = useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  if (
    !isLoading
    && isAuthenticated
  ) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");
      setSubmitting(true);

      try {
        await login(
          email,
          password,
        );

        const destination =
          location
            .state
            ?.from
          ?? "/admin";

        navigate(
          destination,
          {
            replace: true,
          },
        );
      } catch (requestError) {
        setError(
          requestError
            .response
            ?.data
            ?.errors
            ?.email
            ?.[0]
          ?? requestError
            .response
            ?.data
            ?.message
          ?? "Login failed.",
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <LockKeyhole size={28} />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-950">
            Admin Login
          </h1>

          <p className="mt-2 text-slate-500">
            Alishan Accommodation
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="admin-email"
              className="text-sm font-semibold text-slate-700"
            >
              Email
            </label>

            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3.5 size-5 text-slate-400" />

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                required
                autoComplete="email"
                className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <div className="relative mt-2">
              <LockKeyhole className="absolute left-3 top-3.5 size-5 text-slate-400" />

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                required
                autoComplete="current-password"
                className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {error ? (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-5 shrink-0" />

              <p>{error}</p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}