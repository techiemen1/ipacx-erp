import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { CheckIcon } from '@heroicons/react/20/solid';

interface Organization {
    id: string; // This is the slug
    name: string;
}

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    // Step 2 State
    const [step, setStep] = useState<'credentials' | 'org_select'>('credentials');
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [token, setToken] = useState('');

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await authApi.login({ username, password });
            const orgs = res.data.organizations || [];

            if (orgs.length === 0) {
                setError('No organizations found. Please contact Support.');
                return;
            }

            // ALWAYS show organization selection for professional feel & clarity
            setOrganizations(orgs);
            if (orgs.length > 0) setSelectedOrg(orgs[0]);
            setToken(res.data.token);
            setStep('org_select');

        } catch (err: any) {
            console.error(err);
            setError('Invalid credentials');
        }
    };

    const handleOrgSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOrg && token) {
            login(username, selectedOrg.id, token);
            navigate('/');
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden bg-slate-900">
            {/* Abstract Mesh Gradient Background */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-700/30 blur-[100px] animate-pulse" />
                <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-600/20 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[100px]" />
            </div>

            <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">IPACX ERP</h2>
                    <p className="mt-2 text-sm text-slate-400 uppercase tracking-widest font-semibold">
                        Enterprise Access
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 relative overflow-hidden">
                    {/* Glass Shine Effect */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

                    <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                        <h3 className="text-xl font-semibold text-white/90">
                            {step === 'credentials' ? 'Sign in to your account' : 'Select Workspace'}
                        </h3>
                        {step === 'org_select' && (
                            <p className="mt-1 text-sm text-slate-400">Choose your organization environment.</p>
                        )}
                    </div>

                    {error && (
                        <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-400">{error}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'credentials' ? (
                        <form className="space-y-6" onSubmit={handleCredentialsSubmit}>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-slate-300">
                                    Username
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2.5 border border-white/10 rounded-lg bg-slate-900/50 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2.5 border border-white/10 rounded-lg bg-slate-900/50 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleOrgSubmit}>
                            <div className="space-y-3">
                                {organizations.map((org) => (
                                    <div
                                        key={org.id}
                                        onClick={() => setSelectedOrg(org)}
                                        className={`group relative flex items-center p-4 cursor-pointer rounded-lg border transition-all duration-200 ${selectedOrg?.id === org.id
                                                ? 'bg-indigo-600/20 border-indigo-500/50 ring-1 ring-indigo-500/50'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="h-10 w-10 rounded-md bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                            <span className="text-white font-bold text-lg">{org.name.charAt(0)}</span>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className={`text-sm font-medium ${selectedOrg?.id === org.id ? 'text-white' : 'text-slate-200'}`}>
                                                {org.name}
                                            </p>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider">{org.id}</p>
                                        </div>
                                        {selectedOrg?.id === org.id && (
                                            <div className="h-5 w-5 bg-indigo-500 rounded-full flex items-center justify-center">
                                                <CheckIcon className="h-3 w-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    Enter Workspace
                                </button>
                            </div>
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setStep('credentials')}
                                    className="text-sm text-slate-400 hover:text-white transition-colors"
                                >
                                    ← Back to Login
                                </button>
                            </div>
                        </form>
                    )}
                </div>
                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-600">
                        © 2026 IPACX Systems. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
