import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchExperiences, 
    postExperience, 
    updateExperience, 
    deleteExperience, 
    OpenAddModal, 
    OpenEditModal, 
    CloseModal, 
    setFormField 
} from '../../Redux/experienceSlice';

const Experience = () => {
    const dispatch = useDispatch();
    const { experiences, isModalOpen, editId, experience, loading, error } = useSelector((state) => state.experiences);

    useEffect(() => {
        dispatch(fetchExperiences());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        dispatch(setFormField({ field: name, value: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editId) {
            dispatch(updateExperience({ id: editId, expData: experience }));
        } else {
            dispatch(postExperience(experience));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                            {/* Briefcase Icon */}
                            <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Experience & Career
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your professional background and work history.</p>
                    </div>
                    <button 
                        onClick={() => dispatch(OpenAddModal())}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {/* Plus Icon */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Experience
                    </button>
                </div>

                {/* Feedback States */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                )}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl text-red-700 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Experience List */}
                <div className="space-y-4">
                    {Array.isArray(experiences) && experiences.length === 0 && !loading && (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">No experience records found yet.</p>
                        </div>
                    )}

                    {Array.isArray(experiences) && experiences.map((item) => (
                        <div 
                            key={item._id || item.id} 
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row justify-between items-start gap-4"
                        >
                            <div className="space-y-2 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-bold text-lg text-gray-900">{item.jobTitle}</h3>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-indigo-600 font-semibold flex items-center gap-1">
                                        {/* Building Icon */}
                                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        {item.company}
                                    </span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    {/* Calendar Icon */}
                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {item.startDate} — {item.current ? (
                                        <span className="text-emerald-600 font-bold ml-1">Present</span>
                                    ) : item.endDate}
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mt-2 whitespace-pre-line">{item.description}</p>
                            </div>

                            <div className="flex sm:flex-col gap-2 self-end sm:self-start">
                                <button 
                                    onClick={() => dispatch(OpenEditModal(item))} 
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                                >
                                    {/* Pencil Icon */}
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                                <button 
                                    onClick={() => dispatch(deleteExperience({ id: item._id || item.id }))} 
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                                >
                                    {/* Trash Icon */}
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal / Dialog */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fadeIn">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-gray-100 transform transition-all">
                            
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    {editId ? 'Edit Experience' : 'Add New Experience'}
                                </h2>
                                <button 
                                    onClick={() => dispatch(CloseModal())}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Job Title</label>
                                    <input 
                                        type="text" 
                                        name="jobTitle" 
                                        value={experience?.jobTitle || ''} 
                                        onChange={handleChange} 
                                        placeholder="e.g. Full Stack Developer"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                                        required 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Company</label>
                                    <input 
                                        type="text" 
                                        name="company" 
                                        value={experience?.company || ''} 
                                        onChange={handleChange} 
                                        placeholder="e.g. Tech Company Inc."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                                        required 
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Start Date</label>
                                        <input 
                                            type="text" 
                                            name="startDate" 
                                            value={experience?.startDate || ''} 
                                            onChange={handleChange} 
                                            placeholder="e.g. Jan 2023"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">End Date</label>
                                        <input 
                                            type="text" 
                                            name="endDate" 
                                            value={experience?.endDate || ''} 
                                            onChange={handleChange} 
                                            placeholder="e.g. Present"
                                            disabled={experience?.current} 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400 transition-all" 
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-1">
                                    <input 
                                        type="checkbox" 
                                        name="current" 
                                        checked={experience?.current || false} 
                                        onChange={handleChange} 
                                        id="current" 
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" 
                                    />
                                    <label htmlFor="current" className="text-sm font-medium text-gray-700 cursor-pointer">I currently work here</label>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                                    <textarea 
                                        name="description" 
                                        value={experience?.description || ''} 
                                        onChange={handleChange} 
                                        placeholder="Describe your responsibilities and achievements..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none" 
                                        rows="3" 
                                        required 
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                                    <button 
                                        type="button" 
                                        onClick={() => dispatch(CloseModal())} 
                                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all"
                                    >
                                        {editId ? 'Save Changes' : 'Add Experience'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Experience;