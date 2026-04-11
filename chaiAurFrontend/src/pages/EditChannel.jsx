import { useState } from "react";
import { useSelector } from "react-redux";
import { FiUser,  FiImage, FiLock, FiCheck, FiUploadCloud } from "react-icons/fi";
import channelService from "../features/channel/channelService";

function SectionCard({icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          <Icon size={18} />
        </span>
        <div>
          <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50">{title}</h2>
          {subtitle && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
        {label}
      </label>
      {children}
    </div>
  );
}

function InputField({ type = "text", placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-700 dark:focus:bg-zinc-900 dark:focus:ring-blue-950/50"
    />
  );
}

function SaveButton({ loading, label, loadingLabel }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-300"
    >
      {loading ? (
        loadingLabel
      ) : (
        <>
          <FiCheck size={14} />
          {label}
        </>
      )}
    </button>
  );
}

function FileUploadField({ label, accept = "image/*", onChange, file }) {
  return (
    <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 px-6 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50/50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-blue-700 dark:hover:bg-blue-950/20">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
        <FiUploadCloud size={22} />
      </span>
      {file ? (
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {file.name}
        </span>
      ) : (
        <>
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {label}
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            PNG, JPG, WEBP — max 5 MB
          </span>
        </>
      )}
      <input type="file" accept={accept} onChange={onChange} className="hidden" />
    </label>
  );
}

export default function EditChannel() {
  const { user } = useSelector((state) => state.auth);

  const [accountData, setAccountData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // Separate loading states per section
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Separate feedback per section (replaces alert())
  const [feedback, setFeedback] = useState({});

  const setMsg = (key, msg, isError = false) => {
    setFeedback((prev) => ({ ...prev, [key]: { msg, isError } }));
    setTimeout(() => setFeedback((prev) => ({ ...prev, [key]: null })), 4000);
  };

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoadingAccount(true);
      await channelService.updateAccountDetails(accountData);
      setMsg("account", "Account updated successfully.");
    } catch (err) {
      setMsg("account", err.response?.data?.message || "Error updating account.", true);
    } finally {
      setLoadingAccount(false);
    }
  };

  const handleAvatarUpdate = async (e) => {
    e.preventDefault();
    if (!avatarFile) return setMsg("avatar", "Please select an image first.", true);
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    try {
      setLoadingAvatar(true);
      await channelService.updateAvatar(formData);
      setMsg("avatar", "Avatar updated successfully.");
      setAvatarFile(null);
    } catch (err) {
      setMsg("avatar", err.response?.data?.message || "Error updating avatar.", true);
    } finally {
      setLoadingAvatar(false);
    }
  };

  const handleCoverUpdate = async (e) => {
    e.preventDefault();
    if (!coverFile) return setMsg("cover", "Please select an image first.", true);
    const formData = new FormData();
    formData.append("coverImage", coverFile);
    try {
      setLoadingCover(true);
      await channelService.updateCoverImage(formData);
      setMsg("cover", "Cover image updated successfully.");
      setCoverFile(null);
    } catch (err) {
      setMsg("cover", err.response?.data?.message || "Error updating cover.", true);
    } finally {
      setLoadingCover(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6)
      return setMsg("password", "New password must be at least 6 characters.", true);
    try {
      setLoadingPassword(true);
      await channelService.changePassword(passwordData);
      setMsg("password", "Password changed successfully.");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setMsg("password", err.response?.data?.message || "Error changing password.", true);
    } finally {
      setLoadingPassword(false);
    }
  };

  const Feedback = ({ id }) =>
    feedback[id] ? (
      <p
        className={`mt-3 rounded-xl px-4 py-2.5 text-sm font-medium ${
          feedback[id].isError
            ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
            : "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
        }`}
      >
        {feedback[id].msg}
      </p>
    ) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">

      <div className="mb-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
          Settings
        </p>
        <h1 className="mt-1 text-3xl font-black text-zinc-950 dark:text-zinc-50">
          Edit Channel
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your account details, profile images, and security settings.
        </p>
      </div>

      <SectionCard
        icon={FiUser}
        title="Account Details"
        subtitle="Update your display name and email address."
      >
        <form onSubmit={handleAccountUpdate} className="space-y-4">
          <Field label="Full name">
            <InputField
              value={accountData.fullName}
              onChange={(e) => setAccountData({ ...accountData, fullName: e.target.value })}
              placeholder="Your full name"
            />
          </Field>
          <Field label="Email address">
            <InputField
              type="email"
              value={accountData.email}
              onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
              placeholder="you@example.com"
            />
          </Field>
          <div className="pt-1">
            <SaveButton loading={loadingAccount} label="Save changes" loadingLabel="Saving..." />
          </div>
          <Feedback id="account" />
        </form>
      </SectionCard>

      <SectionCard
        icon={FiImage}
        title="Profile Picture"
        subtitle="Shown on your channel and next to your comments."
      >
        <form onSubmit={handleAvatarUpdate} className="space-y-4">
          <FileUploadField
            label="Click to upload a new avatar"
            file={avatarFile}
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
          <SaveButton loading={loadingAvatar} label="Upload avatar" loadingLabel="Uploading..." />
          <Feedback id="avatar" />
        </form>
      </SectionCard>


      <SectionCard
        icon={FiImage}
        title="Cover Image"
        subtitle="Displayed as the banner at the top of your channel page."
      >
        <form onSubmit={handleCoverUpdate} className="space-y-4">
          <FileUploadField
            label="Click to upload a new cover image"
            file={coverFile}
            onChange={(e) => setCoverFile(e.target.files[0])}
          />
          <SaveButton loading={loadingCover} label="Upload cover" loadingLabel="Uploading..." />
          <Feedback id="cover" />
        </form>
      </SectionCard>
      
      <SectionCard
        icon={FiLock}
        title="Change Password"
        subtitle="Use a strong password you don't use anywhere else."
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Field label="Current password">
            <InputField
              type="password"
              placeholder="Enter current password"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
            />
          </Field>
          <Field label="New password">
            <InputField
              type="password"
              placeholder="Min. 6 characters"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
          </Field>
          <div className="pt-1">
            <SaveButton loading={loadingPassword} label="Change password" loadingLabel="Changing..." />
          </div>
          <Feedback id="password" />
        </form>
      </SectionCard>

    </div>
  );
}