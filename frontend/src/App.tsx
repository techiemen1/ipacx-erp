import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import InventoryDashboard from './pages/Inventory/Dashboard';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

function Dashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">$0.00</dd>
                </div>
            </div>
        </div>
    )
}

function Accounting() {
    return <h1 className="text-2xl font-bold">Accounting Module</h1>
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { user } = useAuth();
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
                        <Route index element={<Dashboard />} />
                        <Route path="accounting" element={<Accounting />} />
                        <Route path="inventory" element={<InventoryDashboard />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
