import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Organization {
    id: string;
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
            {/* Left Side - Corporate Navy */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
                {/* Subtle Corporate Pattern */}
                <svg className="absolute inset-0 h-full w-full stroke-white/5 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
                    <defs>
                        <pattern id="983e3e43-13e7-4ea9-874f-9e8c37d6cb41" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
                            <path d="M.5 200V.5H200" fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" strokeWidth="0" fill="url(#983e3e43-13e7-4ea9-874f-9e8c37d6cb41)" />
                </svg>
                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="h-10 w-10 bg-indigo-500 rounded flex items-center justify-center">
                            <span className="font-bold text-xl">I</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">IPACX ERP</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Enterprise Resource Planning</h1>
                    <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                        Manage your accounting, inventory, and human resources with distinct corporate precision.
                    </p>
                </div>
            </div>

            {/* Right Side - Clean Form */}
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            {step === 'credentials' ? 'Sign in to access' : 'Select Organization'}
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            {step === 'credentials' ? 'Secure usage is monitored.' : 'Choose target workspace.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-md bg-red-50 p-4 border-l-4 border-red-500">
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
                                    <label htmlFor="username" className="block text-sm font-semibold leading-6 text-slate-900">
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
                                            className="block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold leading-6 text-slate-900">
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
                                            className="block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Authenticate
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleOrgSubmit} className="space-y-6">
                                <div className="relative">
                                    <label className="block text-sm font-semibold leading-6 text-slate-900 mb-2">
                                        Organization Instance
                                    </label>
                                    <Listbox value={selectedOrg} onChange={setSelectedOrg}>
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-3 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                <span className="block truncate">{selectedOrg?.name}</span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                </span>
                                            </Listbox.Button>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {organizations.map((org) => (
                                                        <Listbox.Option
                                                            key={org.id}
                                                            className={({ active }) =>
                                                                `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                                                }`
                                                            }
                                                            value={org}
                                                        >
                                                            {({ selected, active }) => (
                                                                <>
                                                                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                                                        {org.name}
                                                                    </span>
                                                                    {selected ? (
                                                                        <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-white' : 'text-indigo-600'}`}>
                                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </Listbox>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Access Workspace
                                    </button>
                                </div>
                                <div className="text-center">
                                    <button type="button" onClick={() => setStep('credentials')} className="text-sm text-slate-500 hover:text-slate-900">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
                <div className="mt-8 text-center text-xs text-slate-500 font-medium">
                    © 2026 TECHIEMEN, INDIA. All rights reserved.
                </div>
            </div>
        </div>
    );
}
