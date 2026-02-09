import { Link } from 'react-router-dom';
import { PublicLayout } from '../layout/PublicLayout';
import { Building2, ShieldCheck, Users } from 'lucide-react';

export default function Home() {
    return (
        <PublicLayout>
            <div className="relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block">Find the perfect tenant</span>
                            <span className="block text-blue-600">via WhatsApp</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            PaDen connects you directly with verified students and professionals looking for accommodation. Manage your properties effortlessly.
                        </p>
                        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                            <div className="rounded-md shadow">
                                <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                                    Get Started
                                </Link>
                            </div>
                            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                                <a href="#features" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                                    Learn More
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="features" className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Why use PaDen?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                    <Users size={24} />
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Direct Connection</h3>
                            <p className="text-gray-500">Connect directly with potential tenants on WhatsApp. No middlemen.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-green-100 rounded-full text-green-600">
                                    <ShieldCheck size={24} />
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Verified Listings</h3>
                            <p className="text-gray-500">Build trust with a verified badge. Tenants prefer safe, verified landlords.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                                    <Building2 size={24} />
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Easy Management</h3>
                            <p className="text-gray-500">Update availability, prices, and photos instantly from your dashboard.</p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
