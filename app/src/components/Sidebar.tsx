import { Link, useLocation } from "react-router-dom";
import { Home, Users, Brain, FileText, List } from "lucide-react";

export default function Sidebar() {
  const { pathname } = useLocation();
  const links = [
    { to: "/", label: "Dashboard", icon: Home },
    { to: "/agents", label: "Agents", icon: Users },
    { to: "/memory", label: "Memory", icon: Brain },
    { to: "/logs", label: "Logs", icon: List },
    { to: "/approvals", label: "Approvals", icon: FileText },
  ];

  return (
    <aside className="w-56 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 text-lg font-semibold text-amber-400">
        Americana Agents
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 ${
              pathname === to ? "bg-gray-700 text-amber-400" : ""
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );

}
