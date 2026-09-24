import React from 'react';

const Footer = ({ bio }) => {
    return (
        <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6 sm:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* Brand Info */}
                <div className="text-center md:text-left">
                    <span className="text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                        {bio?.name || 'Portfolio'}
                    </span>
                    <p className="text-slate-500 text-xs mt-1">
                        {bio?.headline || 'Full Stack Web Developer'}
                    </p>
                </div>

                {/* Quick Social Links */}
                <div className="flex items-center gap-6 text-sm">
                    {bio?.github && (
                        <a href={bio.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors">
                            GitHub
                        </a>
                    )}
                    {bio?.linkedin && (
                        <a href={bio.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors">
                            LinkedIn
                        </a>
                    )}
                    <a href="#contact" className="text-slate-400 hover:text-teal-400 transition-colors">
                        Contact
                    </a>
                </div>

                {/* Copyright */}
                <div className="text-slate-600 text-xs text-center md:text-right">
                    © {new Date().getFullYear()} All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer; 