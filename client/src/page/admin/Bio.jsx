import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBio, updateBio, setBioField } from '../../Redux/bioSlice';

const Bio = () => {
    const dispatch = useDispatch();
    const { bio, loading, error } = useSelector((state) => state.bio);

    useEffect(() => {
        dispatch(fetchBio());
    }, [dispatch]);

    const handleChange = (e) => {
        dispatch(setBioField({ field: e.target.name, value: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateBio(bio));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                        <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Manage Bio & Profile
                    </h1>
                    <p className="text-sm text-gray-505 mt-1">Update your personal information and portfolio details.</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl text-red-700 text-sm flex items-center gap-2 shadow-sm">
                        <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={bio.name || ''} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Professional Headline</label>
                            <input 
                                type="text" 
                                name="headline" 
                                value={bio.headline || ''} 
                                onChange={handleChange} 
                                placeholder="e.g. Full Stack Web Developer"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">About Me</label>
                        <textarea 
                            name="aboutText" 
                            value={bio.aboutText || ''} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none" 
                            rows="4" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Resume URL</label>
                        <input 
                            type="text" 
                            name="resumeUrl" 
                            value={bio.resumeUrl || ''} 
                            onChange={handleChange} 
                            placeholder="Link to your CV/Resume"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">GitHub URL</label>
                            <input 
                                type="text" 
                                name="github" 
                                value={bio.github || ''} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">LinkedIn URL</label>
                            <input 
                                type="text" 
                                name="linkedin" 
                                value={bio.linkedin || ''} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <button 
                            type="submit" 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Save Bio Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Bio;