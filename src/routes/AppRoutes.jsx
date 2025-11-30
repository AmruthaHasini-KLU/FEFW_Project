import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home/Home';
import Login from '@/pages/Auth/Login';
import Signup from '@/pages/Auth/Signup';
import Features from '@/pages/Features/Features';
import HowItWorks from '@/pages/HowItWorks/HowItWorks';
import Support from '@/pages/Support/Support';
import NotFound from '@/pages/NotFound';
import LenderDashboard from '@/pages/Dashboard/Lender/LenderDashboard';
import LenderOffers from '@/pages/Dashboard/Lender/LenderOffers';
import LenderBorrowers from '@/pages/Dashboard/Lender/LenderBorrowers';
import LenderPayments from '@/pages/Dashboard/Lender/LenderPayments';
import LenderReports from '@/pages/Dashboard/Lender/LenderReports';

import BorrowerDashboard from '@/pages/Dashboard/Borrower/BorrowerDashboard';
import BorrowerOffers from '@/pages/Dashboard/Borrower/BorrowerOffers';
import BorrowerPayments from '@/pages/Dashboard/Borrower/BorrowerPayments';
import BorrowerDocuments from '@/pages/Dashboard/Borrower/BorrowerDocuments';
import BorrowerApply from '@/pages/Dashboard/Borrower/Apply';

import AdminDashboard from '@/pages/Dashboard/Admin/AdminDashboard';
import AdminReports from '@/pages/Dashboard/Admin/AdminReports';
import AdminUsers from '@/pages/Dashboard/Admin/AdminUsers';
import AdminRoles from '@/pages/Dashboard/Admin/AdminRoles';
import AdminActivity from '@/pages/Dashboard/Admin/AdminActivity';
import AdminSettings from '@/pages/Dashboard/Admin/AdminSettings';

import AnalystDashboard from '@/pages/Dashboard/Analyst/AnalystDashboard';
import AnalystReports from '@/pages/Dashboard/Analyst/AnalystReports';
import AnalystDataAnalysis from '@/pages/Dashboard/Analyst/AnalystDataAnalysis';
import AnalystSettings from '@/pages/Dashboard/Analyst/AnalystSettings';
import LoanCalculator from '@/pages/Dashboard/Shared/LoanCalculator';
import Profile from '@/pages/Dashboard/Shared/Profile';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Router>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/features" element={<Features />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/support" element={<Support />} />

            <Route 
              path="/dashboard/lender" 
              element={
                <ProtectedRoute allowedRoles={['lender']}>
                  <LenderDashboard />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/dashboard/lender/offers"
              element={
                <ProtectedRoute allowedRoles={['lender']}>
                  <LenderOffers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/lender/borrowers"
              element={
                <ProtectedRoute allowedRoles={['lender']}>
                  <LenderBorrowers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/lender/payments"
              element={
                <ProtectedRoute allowedRoles={['lender']}>
                  <LenderPayments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/lender/reports"
              element={
                <ProtectedRoute allowedRoles={['lender']}>
                  <LenderReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/lender/loan-calculator"
              element={
                <ProtectedRoute allowedRoles={['lender', 'admin', 'analyst', 'borrower']}>
                  <LoanCalculator role="lender" />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/dashboard/borrower" 
              element={
                <ProtectedRoute allowedRoles={['borrower']}>
                  <BorrowerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/dashboard/borrower/offers"
              element={
                <ProtectedRoute allowedRoles={['borrower']}>
                  <BorrowerOffers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/borrower/payments"
              element={
                <ProtectedRoute allowedRoles={['borrower']}>
                  <BorrowerPayments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/borrower/loan-calculator"
              element={
                <ProtectedRoute allowedRoles={['borrower', 'admin', 'lender', 'analyst']}>
                  <LoanCalculator role="borrower" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute allowedRoles={['admin','lender','borrower','analyst']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/borrower/documents"
              element={
                <ProtectedRoute allowedRoles={['borrower']}>
                  <BorrowerDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/borrower/apply"
              element={
                <ProtectedRoute allowedRoles={['borrower']}>
                  <BorrowerApply />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/dashboard/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/dashboard/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/roles"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminRoles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/activity"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminActivity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/loan-calculator"
              element={
                <ProtectedRoute allowedRoles={['admin', 'lender', 'analyst', 'borrower']}>
                  <LoanCalculator role="admin" />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/dashboard/analyst" 
              element={
                <ProtectedRoute allowedRoles={['analyst']}>
                  <AnalystDashboard />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/dashboard/analyst/reports"
              element={
                <ProtectedRoute allowedRoles={['analyst']}>
                  <AnalystReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/analyst/data-analysis"
              element={
                <ProtectedRoute allowedRoles={['analyst']}>
                  <AnalystDataAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/analyst/settings"
              element={
                <ProtectedRoute allowedRoles={['analyst']}>
                  <AnalystSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/analyst/loan-calculator"
              element={
                <ProtectedRoute allowedRoles={['analyst', 'admin', 'lender', 'borrower']}>
                  <LoanCalculator role="analyst" />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
