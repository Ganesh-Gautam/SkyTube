import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { login } from "../features/auth/authSlice.js";

export default function Login() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await dispatch(login(form)).unwrap();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 bg-white dark:bg-zinc-900 transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="rounded-4xl border border-zinc-200 dark:border-zinc-700 
                  bg-white dark:bg-zinc-800 
                  p-8 shadow-lg transition"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
          Sign in
        </p>

        <h2 className="mt-3 text-3xl font-black text-zinc-950 dark:text-white">
          Login to your account
        </h2>

        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Use the email and password you registered with.
        </p>

        <div className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Email
            </span>

            <div className="flex items-center gap-3 rounded-2xl 
                            border border-zinc-200 dark:border-zinc-600 
                            bg-zinc-50 dark:bg-zinc-700 
                            px-4 py-3 
                            focus-within:border-blue-400 
                            focus-within:bg-white dark:focus-within:bg-zinc-600">

              <FiMail className="text-zinc-400 dark:text-zinc-300" size={18} />

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm 
                          text-zinc-900 dark:text-white 
                          outline-none 
                          placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Password
            </span>

            <div className="flex items-center gap-3 rounded-2xl 
                            border border-zinc-200 dark:border-zinc-600 
                            bg-zinc-50 dark:bg-zinc-700 
                            px-4 py-3 
                            focus-within:border-blue-400 
                            focus-within:bg-white dark:focus-within:bg-zinc-600">

              <FiLock className="text-zinc-400 dark:text-zinc-300" size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full bg-transparent text-sm 
                          text-zinc-900 dark:text-white 
                          outline-none 
                          placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="text-zinc-400 dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-white transition"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 w-full rounded-2xl 
                    bg-zinc-950 dark:bg-white 
                    text-white dark:text-zinc-900 
                    px-5 py-3.5 text-sm font-semibold 
                    hover:bg-zinc-800 dark:hover:bg-zinc-200 
                    transition disabled:opacity-70
                    hover:cursor-pointer
                    "
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </button>

        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          New here?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
