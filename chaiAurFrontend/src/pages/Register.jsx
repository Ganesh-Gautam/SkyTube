import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff, FiImage, FiLock, FiMail, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import { register } from "../features/auth/authSlice";

const inputBaseClassName =
  "w-full rounded-2xl border border-zinc-200 dark:border-zinc-600 \
   bg-zinc-50 dark:bg-zinc-700 \
   px-4 py-3 text-sm \
   text-zinc-900 dark:text-white \
   outline-none transition \
   placeholder:text-zinc-400 dark:placeholder:text-zinc-500 \
   focus:border-blue-400 \
   focus:bg-white dark:focus:bg-zinc-600";

const inputWrapperClass =
  "flex items-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-600 " +
  "bg-zinc-50 dark:bg-zinc-700 px-4 py-3 " +
  "focus-within:border-blue-400 focus-within:bg-white dark:focus-within:bg-zinc-600";


const Register = () => {
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
    <div className="bg-white dark:bg-zinc-900 min-h-screen transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="rounded-4xl border border-zinc-200 dark:border-zinc-700 
                    bg-white dark:bg-zinc-800 p-8 shadow-lg transition"
      >

        <h1 className="mt-3 text-3xl font-black text-zinc-950 dark:text-white">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Set up your profile once, then start exploring World.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Full name
            </span>
            <div className={inputWrapperClass}>
              <FiUser className="text-zinc-400 dark:text-zinc-300" />
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Pankaj Kumar"
                className="w-full bg-transparent outline-none text-sm text-zinc-900 dark:text-white"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Email
            </span>
            <div className={inputWrapperClass}>
              <FiMail className="text-zinc-400 dark:text-zinc-300" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-transparent outline-none text-sm text-zinc-900 dark:text-white"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Username
            </span>
            <div className={inputWrapperClass}>
              <FiUser className="text-zinc-400 dark:text-zinc-300" />
              <input
                type="text"
                name="userName"
                value={form.userName}
                onChange={handleChange}
                placeholder="mytube_creator"
                className="w-full bg-transparent outline-none text-sm text-zinc-900 dark:text-white"
              />
            </div>
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Password
            </span>
            <div className={inputWrapperClass}>
              <FiLock className="text-zinc-400 dark:text-zinc-300" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Choose a secure password"
                className="w-full bg-transparent outline-none text-sm text-zinc-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-zinc-400 dark:text-zinc-300"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <input type="file" onChange={(e) => setAvatar(e.target.files?.[0])} className={inputBaseClassName} />
          <input type="file" onChange={(e) => setCoverImage(e.target.files?.[0])} className={inputBaseClassName} />
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
            hover:cursor-pointer"
        >
          {isSubmitting ? "Creating..." : "Register"} 
        </button>

        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>

      <section
        className="rounded-4xl p-8 shadow-xl  transition
          
          /* LIGHT MODE (softer gradient) */
          bg-[linear-gradient(135deg,#e0f2fe_0%,#ccfbf1_45%,#fef3c7_100%)]
          text-zinc-900
          
          /* DARK MODE (your original strong gradient) */
          dark:bg-[linear-gradient(135deg,#111827_0%,#0f766e_45%,#f59e0b_100%)]
          dark:text-white"
      >
        <h2 className="mt-4 text-4xl font-black leading-tight">
          Build your profile
        </h2>

        <p className="mt-4 text-sm leading-6 
        text-zinc-700 dark:text-white/80">
          Add an avatar, optional cover image, and a clean username so your channel is ready from
          day one.
        </p>

        <div className="mt-8 grid gap-4">
          <div
            className="rounded-3xl p-4 backdrop-blur transition
              border border-zinc-200 bg-white/60
              dark:border-white/15 dark:bg-white/10"
          >
            <div className="flex items-center gap-3">
              
              <div
                className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full
                bg-zinc-200 dark:bg-white/15"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiUser size={20} />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Avatar preview
                </p>

                <p className="text-xs text-zinc-600 dark:text-white/70">
                  {avatar ? avatar.name : "Upload an avatar to preview it here"}
                </p>
              </div>
            </div>
          </div>

          <div
            className="rounded-3xl p-4 backdrop-blur transition
              border border-zinc-200 bg-white/60
              dark:border-white/15 dark:bg-white/10"
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <FiImage size={16} />
              Cover preview
            </div>

            <div
              className="overflow-hidden rounded-2xl transition       
                border border-zinc-200 bg-white/60
                dark:border-white/10 dark:bg-white/10"
            >
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center text-sm 
                  text-zinc-600 dark:text-white/70">
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

export default Register;
