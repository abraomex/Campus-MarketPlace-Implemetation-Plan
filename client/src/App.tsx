import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { NotificationToastContainer } from "./components/common/NotificationToastContainer";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CreateListingPage } from "./pages/CreateListingPage";
import { EditListingPage } from "./pages/EditListingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { MessagesPage } from "./pages/MessagesPage";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <NotificationToastContainer />
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
            <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes (Require Student Sign-In) */}
              <Route
                path="/sell"
                element={
                  <ProtectedRoute>
                    <CreateListingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditListingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
