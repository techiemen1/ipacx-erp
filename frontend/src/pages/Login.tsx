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
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-800 opacity-90" />
                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <h1 className="text-5xl font-bold mb-6">IPACX ERP</h1>
                    <p className="text-xl text-indigo-100">
                        Enterprise Resource Planning for the Modern Era.
                        Streamline your operations with intelligence.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            {step === 'credentials' ? 'Welcome back' : 'Select Workspace'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {step === 'credentials' ? 'Please enter your details to sign in.' : 'Choose the organization you want to access.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-100">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        {step === 'credentials' ? (
                            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                        Username
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                        Password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleOrgSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    {organizations.map((org) => (
                                        <div
                                            key={org.id}
                                            onClick={() => setSelectedOrg(org)}
                                            className={`relative flex items-center space-x-3 rounded-lg border px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 cursor-pointer ${selectedOrg?.id === org.id ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white'
                                                }`}
                                        >
                                            <div className="min-w-0 flex-1">
                                                <span className="absolute inset-0" aria-hidden="true" />
                                                <p className="text-sm font-medium text-gray-900">{org.name}</p>
                                                <p className="truncate text-sm text-gray-500">ID: {org.id}</p>
                                            </div>
                                            {selectedOrg?.id === org.id && (
                                                <CheckIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Enter Workspace
                                    </button>
                                </div>
                                <div className="text-center">
                                    <button type="button" onClick={() => setStep('credentials')} className="text-sm text-gray-500 hover:text-gray-900">
                                        Back to Login
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
