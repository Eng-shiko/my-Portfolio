import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ bio }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 h-20 flex items-center justify-between">
                
                {/* Brand / Logo */}
                <Link to="/" className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></span>
                    {bio?.name || 'Portfolio'}
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <a href="#about" className="hover:text-orange-400 transition-colors">About</a>
                    <a href="#works" className="hover:text-orange-400 transition-colors">Projects</a>
                    <a href="#experience" className="hover:text-orange-400 transition-colors">Experience</a>
                    <a href="#skills" className="hover:text-orange-400 transition-colors">Skills</a>
                    <a href="#contact" className="hover:text-orange-400 transition-colors">Contact</a>
                </div>

                {/* Admin Dashboard & Logout (Appears ONLY when logged in) */}
                <div className="hidden md:flex items-center gap-3">
                    {isLoggedIn && (
                        <>
                            <Link 
                                to="/admin" 
                                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition-all shadow-lg shadow-orange-600/20"
                            >
                                Admin Dashboard
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle Button */}
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="md:hidden text-slate-300 hover:text-white focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-6 py-6 space-y-4 animate-fade-in">
                    <a href="#about" onClick={() => setIsOpen(false)} className="block text-slate-300 hover:text-orange-400 text-sm font-medium">About</a>
                    <a href="#works" onClick={() => setIsOpen(false)} className="block text-slate-300 hover:text-orange-400 text-sm font-medium">Projects</a>
                    <a href="#experience" onClick={() => setIsOpen(false)} className="block text-slate-300 hover:text-orange-400 text-sm font-medium">Experience</a>
                    <a href="#skills" onClick={() => setIsOpen(false)} className="block text-slate-300 hover:text-orange-400 text-sm font-medium">Skills</a>
                    <a href="#contact" onClick={() => setIsOpen(false)} className="block text-slate-300 hover:text-orange-400 text-sm font-medium">Contact</a>
                    
                    {/* Mobile Admin Controls (Appears ONLY when logged in) */}
                    {isLoggedIn && (
                        <div className="pt-4 border-t border-slate-800 space-y-2">
                            <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-center w-full py-2.5 rounded-xl bg-orange-600 text-white text-xs font-semibold">
                                Admin Dashboard
                            </Link>
                            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block text-center w-full py-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;