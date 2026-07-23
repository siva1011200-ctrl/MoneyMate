import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import Income from "../pages/Income";
import Expenses from "../pages/Expenses";
import Budget from "../pages/Budget";
import SavingsGoals from "../pages/SavingsGoals";
import Analytics from "../pages/Analytics";
import Transactions from "../pages/Transactions";
import Profile from "../pages/Profile";

import ProtectedRoute from "./ProtectedRoute";


function AppRoutes(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Landing />} />

<Route path="/login" element={<Login />} />

<Route path="/register" element={<Register />} />



<Route
path="/dashboard"
element={
<ProtectedRoute>
<Dashboard />
</ProtectedRoute>
}
/>



<Route
path="/income"
element={
<ProtectedRoute>
<Income />
</ProtectedRoute>
}
/>



<Route
path="/expenses"
element={
<ProtectedRoute>
<Expenses />
</ProtectedRoute>
}
/>



<Route
path="/budget"
element={
<ProtectedRoute>
<Budget />
</ProtectedRoute>
}
/>



<Route
path="/savings-goals"
element={
<ProtectedRoute>
<SavingsGoals />
</ProtectedRoute>
}
/>



<Route
path="/analytics"
element={
<ProtectedRoute>
<Analytics />
</ProtectedRoute>
}
/>



<Route
path="/transactions"
element={
<ProtectedRoute>
<Transactions />
</ProtectedRoute>
}
/>



<Route
path="/profile"
element={
<ProtectedRoute>
<Profile />
</ProtectedRoute>
}
/>



</Routes>

</BrowserRouter>

)

}

export default AppRoutes;