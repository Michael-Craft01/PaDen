import React from 'react';
import { Link } from 'react-router-dom';

export const PublicLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gray-50 font-sans">
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {/* Logo Placeholder */}
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
                    <span className="font-bold text-xl text-gray-900">PaDen</span>
                </div>
                <nav className="flex items-center gap-4">
                    <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
                    <Link to="/login" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md shadow-blue-200">
                        Login
                    </Link>
                </nav>
            </div>
        </header>
        <main>
            {children}
        </main>
        <footer className="bg-white border-t mt-20 py-12">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
                &copy; {new Date().getFullYear()} PaDen. All rights reserved.
            </div>
        </footer>
    </div>
);
