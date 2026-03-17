import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-gray-200 p-4">
      <nav className="flex flex-col gap-3">
        <Link to="/">Home</Link>
        <Link to="/subscribedChannels">Subscriptions</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
    </aside>
  );
}
