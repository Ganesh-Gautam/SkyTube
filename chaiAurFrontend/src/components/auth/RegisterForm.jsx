import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FiArrowRight, FiEye, FiEyeOff, FiImage, FiLock, FiMail, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import { register } from "../../features/auth/authSlice";

const inputBaseClassName =
  "w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-400 focus:bg-white";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    userName: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const avatarPreview = useMemo(
    () => (avatar ? URL.createObjectURL(avatar) : null),
    [avatar]
  );

  const coverPreview = useMemo(
    () => (coverImage ? URL.createObjectURL(coverImage) : null),
    [coverImage]
  );

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [avatarPreview, coverPreview]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!avatar) {
      toast.error("Avatar is required");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("userName", form.userName);
    formData.append("password", form.password);
    formData.append("avatar", avatar);

    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    setIsSubmitting(true);

    try {
      await dispatch(register(formData)).unwrap();
      toast.success("Registered successfully");
    } catch (err) {
      toast.error(err?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-4xl border border-zinc-200 bg-white p-8 shadow-lg"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">Join in</p>
        <h1 className="mt-3 text-3xl font-black text-zinc-950">Create your account</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Set up your profile once, then start exploring World.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-zinc-700">Full name</span>
            <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 focus-within:border-blue-400 focus-within:bg-white">
              <FiUser className="text-zinc-400" size={18} />
              <input
                type="text"
                name="fullName"
                placeholder="Pankaj Kumar"
                value={form.fullName}
                onChange={handleChange}
                className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-zinc-700">Email</span>
            <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 focus-within:border-blue-400 focus-within:bg-white">
              <FiMail className="text-zinc-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-zinc-700">Username</span>
            <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 focus-within:border-blue-400 focus-within:bg-white">
              <FiUser className="text-zinc-400" size={18} />
              <input
                type="text"
                name="userName"
                placeholder="mytube_creator"
                value={form.userName}
                onChange={handleChange}
                className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                required
              />
            </div>
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-zinc-700">Password</span>
            <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 focus-within:border-blue-400 focus-within:bg-white">
              <FiLock className="text-zinc-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Choose a secure password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="text-zinc-400 transition hover:text-zinc-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </label>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-zinc-700">Avatar</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              className={inputBaseClassName}
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-zinc-700">Cover image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className={inputBaseClassName}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating account..." : "Register"}
          <FiArrowRight size={16} />
        </button>

        <p className="mt-6 text-sm text-zinc-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Login here
          </Link>
        </p>
      </form>

      <section className="rounded-4xl bg-[linear-gradient(135deg,#111827_0%,#0f766e_45%,#f59e0b_100%)] p-8 text-white shadow-xl">
        <h2 className="mt-4 text-4xl font-black leading-tight">
          Build your profile
        </h2>
        <p className="mt-4 text-sm leading-6 text-white/80">
          Add an avatar, optional cover image, and a clean username so your channel is ready from
          day one.
        </p>

        <div className="mt-8 grid gap-4">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white/15">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                ) : (
                  <FiUser size={20} />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">Avatar preview</p>
                <p className="text-xs text-white/70">
                  {avatar ? avatar.name : "Upload an avatar to preview it here"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <FiImage size={16} />
              Cover preview
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="h-40 w-full object-cover" />
              ) : (
                <div className="flex h-40 items-center justify-center text-sm text-white/70">
                  Optional cover image preview
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisterForm;
