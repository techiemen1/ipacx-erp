import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import InventoryDashboard from './pages/Inventory/Dashboard';
import AccountingDashboard from './pages/Accounting/Dashboard';
import CRMDashboard from './pages/CRM/Dashboard';
import HRDashboard from './pages/HR/Dashboard';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

// Default Dashboard can just redirect to Inventory or be a Summary
function MainDashboard() {
    return <Navigate to="/inventory" replace />;
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }>
                        {/* Default to Inventory or Summary */}
                        <Route index element={<MainDashboard />} />
                        <Route path="accounting" element={<AccountingDashboard />} />
                        <Route path="inventory" element={<InventoryDashboard />} />
                        <Route path="crm" element={<CRMDashboard />} />
                        <Route path="hr" element={<HRDashboard />} />
                        {/* Settings can share a placeholder for now */}
                        <Route path="settings" element={<div className="p-8"><h1>Settings Module</h1></div>} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
