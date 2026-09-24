import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchSkills, 
    postSkills, 
    updateSkill, 
    deleteSkill, 
    OpenAddModal, 
    OpenEditModal, 
    CloseModal, 
    setFormField 
} from '../../Redux/skillSlice';

const Skill = () => {
    const dispatch = useDispatch();
    const { skills, isModalOpen, editId, skill, loading, error } = useSelector((state) => state.skills);

    useEffect(() => {
        dispatch(fetchSkills());
    }, [dispatch]);

    const handleChange = (e) => {
        dispatch(setFormField({ field: e.target.name, value: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editId) {
            dispatch(updateSkill({ id: editId, skillData: skill }));
        } else {
            dispatch(postSkills(skill));
        }
    };

    return (
        <div className="min-h-screen text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-black tracking-wide">Manage Skills</h1>
                    <button 
                        onClick={() => dispatch(OpenAddModal())}
                        className="bg-purple-600 hover:bg-purple-700 hover:text-black  text-white px-5 py-2.5 rounded-xl font-medium shadow-lg transition duration-200"
                    >
                        + Add New Skill
                    </button>
                </div>

                {/* Global Error Message */}
                {error && <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-xl mb-6 text-sm">{error}</div>}

                {/* Grid of Skills Cards (Dark Theme Design) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(skills) && skills.length > 0 ? (
                        skills.map((item, index) => (
                            <div 
                                key={item._id || item.id || index} 
                                className="bg-[#131b2e] border border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col justify-between hover:border-slate-700 transition"
                            >
                                <div>
                                    {/* Top Row: Icon, Title & Action Buttons */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center space-x-4">
                                            {/* Icon Placeholder Box */}
                                            <div className="w-12 h-12 rounded-xl bg-purple-950/50 border border-purple-800/40 flex items-center justify-center text-purple-400 font-bold text-lg">
                                                {item.name ? item.name.charAt(0).toUpperCase() : '⚡'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-white mb-1.5">
                                                    {item.name || item.title || 'Unnamed Skill'}
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    <span className="bg-[#1e293b] text-slate-300 text-xs px-3 py-1 rounded-full font-medium">
                                                        {item.category || item.type || 'General'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Icon Buttons */}
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => dispatch(OpenEditModal(item))}
                                                className="p-2 bg-[#1e293b] hover:bg-slate-700 text-slate-300 rounded-xl transition"
                                                title="Edit"
                                            >
                                                {/* Edit Pencil SVG */}
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                            </button>
                                            <button 
                                                onClick={() => dispatch(deleteSkill({ id: item._id || item.id }))}
                                                className="p-2 bg-[#1e293b] hover:bg-red-950/50 text-red-400 rounded-xl transition"
                                                title="Delete"
                                            >
                                                {/* Delete Trash SVG */}
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Divider Line */}
                                    <div className="border-t border-slate-800/80 my-4"></div>

                                    {/* Bottom Progress Section */}
                                    <div className="mt-4">
                                        <div className="flex justify-between items-center text-xs font-semibold text-slate-400 tracking-wider mb-2">
                                            <span>PROFICIENCY METER</span>
                                            <span className="text-sm font-bold text-slate-200">{item.proficiency || 0}%</span>
                                        </div>
                                        <div className="w-full bg-[#1e293b] rounded-full h-2 overflow-hidden">
                                            <div 
                                                className="bg-purple-600 h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(147,51,234,0.5)]" 
                                                style={{ width: `${item.proficiency || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && (
                            <p className="col-span-full text-center text-slate-500 py-16 bg-[#131b2e] rounded-2xl border border-dashed border-slate-800">
                                No skills found. Click "+ Add New Skill" to get started.
                            </p>
                        )
                    )}
                </div>

                {/* Loading Indicator */}
                {loading && skills.length === 0 && (
                    <div className="text-center py-16 text-slate-400">Loading skills...</div>
                )}

                {/* Dark Modal Form */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                        <div className="bg-[#131b2e] border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    {editId ? 'Edit Skill' : 'Add New Skill'}
                                </h2>
                                <button 
                                    onClick={() => dispatch(CloseModal())}
                                    className="text-slate-400 hover:text-white text-2xl font-bold"
                                >
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold tracking-wider text-slate-400 mb-2 uppercase">Skill Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={skill.name} 
                                        onChange={handleChange}
                                        placeholder="e.g. PostgreSQL, React.js"
                                        className="w-full bg-[#0b0f19] border border-slate-800 text-white p-3 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold tracking-wider text-slate-400 mb-2 uppercase">Category</label>
                                    <input 
                                        type="text" 
                                        name="category" 
                                        value={skill.category} 
                                        onChange={handleChange}
                                        placeholder="e.g. Database, Frontend, Backend"
                                        className="w-full bg-[#0b0f19] border border-slate-800 text-white p-3 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold tracking-wider text-slate-400 mb-2 uppercase">Proficiency (%)</label>
                                    <input 
                                        type="number" 
                                        name="proficiency" 
                                        value={skill.proficiency} 
                                        onChange={handleChange}
                                        className="w-full bg-[#0b0f19] border border-slate-800 text-white p-3 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                                        min="0"
                                        max="100"
                                        required 
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => dispatch(CloseModal())}
                                        className="px-4 py-2.5 bg-[#1e293b] text-slate-300 rounded-xl hover:bg-slate-700 transition font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : (editId ? 'Update Skill' : 'Save Skill')}
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
export default Skill;