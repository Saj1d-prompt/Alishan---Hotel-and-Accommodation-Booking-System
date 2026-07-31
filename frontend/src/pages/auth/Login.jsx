export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center">
          Alishan Accommodation
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Sign in to continue
        </p>

        <form className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>

            <input
              type="email"
              placeholder="Enter email"
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>

            <input
              type="password"
              placeholder="Enter password"
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black py-2 text-white hover:bg-gray-800"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}