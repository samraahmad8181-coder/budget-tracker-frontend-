import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginScreen from "./components/loginScreen";
import AdminLayout from "./adminLayout";
import Home from "./pages/Admin/home";
import Expenses from "./pages/Admin/expenses";
import NewExpense from "./components/admin/Expenses/new-expense";
import Trips from "./pages/Admin/trips";
import TripDetails from "./components/admin/Trips/tripsDetail";
import NewTrip from "./components/admin/Trips/new-trip";
import Approvals from "./pages/Admin/approvals";
import ApprovalTable from "./components/admin/Approvals/approvalTable";
import Settings from "./pages/Admin/settings";
const App = () => {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<LoginScreen />} />

      {/* Admin Dashboard */}
      <Route path="/admin" element={<AdminLayout />} >
        <Route index element={<Home />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="expenses/new" element={<NewExpense />} />

        <Route path="trips" element={<Trips />} />
        <Route path="trips/new" element={<NewTrip />} />
        <Route path="trips/:id" element={<TripDetails />} />

        <Route path="approvals" element={<Approvals />} />
        <Route path="approvals/new" element={<ApprovalTable />} />

        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default App;
