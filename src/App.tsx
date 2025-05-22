
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Orders from "./pages/Orders";
import Analysis from "./pages/Analysis";
import NotFound from "./pages/NotFound";
import EmployeeDetail from "./pages/EmployeeDetail";
import OrderDetail from "./pages/OrderDetail";
import OrderAdd from "./pages/OrderAdd";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Dashboard />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/employees" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Employees />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/employees/:id" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <EmployeeDetail />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Orders />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/orders/:id" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <OrderDetail />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/orders/add" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <OrderAdd />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/analysis" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Analysis />
                  </>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
