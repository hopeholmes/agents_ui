import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import StatusIndicator from "./components/StatusIndicator";
import Dashboard from "./pages/Dashboard";
import ApprovalsPage from "./pages/Approvals";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen w-screen bg-gray-900 text-gray-100">
        <Sidebar />
        <main className="flex-1 relative p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Future routes */}
          </Routes>
          <StatusIndicator />
        </main>
      </div>
    </BrowserRouter>
  );
}

