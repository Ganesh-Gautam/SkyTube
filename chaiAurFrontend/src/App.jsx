import { Outlet } from "react-router-dom";
import Header from "./components/common/Header.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_18%,#f8fafc_100%)] text-zinc-950 dark:bg-[linear-gradient(180deg,#09090b_0%,#18181b_40%,#09090b_100%)] dark:text-zinc-50">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
