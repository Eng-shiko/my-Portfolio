import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFolderOpen, faTrash, faEdit, faExternalLinkAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import {
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    openAddModal,
    openEditModal,
    closeModal,
    setFormField,
    setImageFile,
    addTechnology,
    removeTechnology
} from '../../Redux/projectSlice'; 

const Project = () => {
    const dispatch = useDispatch();

    const {
        projects,
        isModalOpen,
        editId,
        project,
        imageFile,
        loading,
        error
    } = useSelector((state) => state.projects);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTechFilter, setSelectedTechFilter] = useState('All');
    const [currentTech, setCurrentTech] = useState('');

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(setFormField({ field: name, value }));
    };

    const handleImageFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            dispatch(setImageFile(e.target.files[0]));
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && currentTech.trim() !== '') {
            e.preventDefault();
            dispatch(addTechnology(currentTech.trim()));
            setCurrentTech('');
        }
    };

    const handleAddTechClick = (e) => {
        e.preventDefault();
        if (currentTech.trim() !== '') {
            dispatch(addTechnology(currentTech.trim()));
            setCurrentTech('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', project.title);
        formData.append('description', project.description);
        formData.append('githubUrl', project.githubUrl);
        formData.append('liveUrl', project.liveUrl);

        project.technology.forEach((tech) => {
            formData.append('technology', tech);
        });

        if (imageFile) {
            formData.append('image', imageFile);
        }

        if (editId) {
            dispatch(updateProject({ id: editId, formData }));
        } else {
            dispatch(createProject(formData));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            dispatch(deleteProject(id));
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:')) {
            return imagePath;
        }
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `http://localhost:5000${cleanPath}`;
    };

    const safeProjects = Array.isArray(projects) ? projects : [];

    const filteredProjects = safeProjects.filter(p => {
        const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTech = selectedTechFilter === 'All' || p.technology?.includes(selectedTechFilter);
        return matchesSearch && matchesTech;
    });

    const allUniqueTechs = ['All', ...new Set(safeProjects.flatMap(p => p.technology || []))];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manage Projects (Database)</h1>
                    <p className="text-sm text-gray-500">Organize and control your database portfolio projects efficiently.</p>
                </div>
                <button 
                    onClick={() => dispatch(openAddModal())}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-blue-500/20 transition duration-200 cursor-pointer"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Add New Project
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-80">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-3 text-gray-400 text-sm" />
                    <input 
                        type="text" 
                        placeholder="Search projects..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {allUniqueTechs.map((tech, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedTechFilter(tech)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition duration-200 cursor-pointer ${
                                selectedTechFilter === tech 
                                    ? 'bg-blue-600 text-white shadow-sm' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {tech}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading & Error States */}
            {loading && <div className="text-center py-6 text-blue-600 font-medium">Loading projects...</div>}
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-6">{error}</div>}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length === 0 ? (
                    <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                        <FontAwesomeIcon icon={faFolderOpen} className="text-4xl text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">No projects found.</p>
                    </div>
                ) : (
                    filteredProjects.map((proj) => {
                        const imageSrc = getImageUrl(proj.imageUrl || proj.image);
                        return (
                            <div key={proj._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition duration-200 group">
                                <div className="h-48 overflow-hidden bg-gray-100 relative">
                                    {imageSrc ? (
                                        <img 
                                            src={imageSrc} 
                                            alt={proj.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs font-medium bg-gray-50 ${imageSrc ? 'hidden' : 'flex'}`}>
                                        <FontAwesomeIcon icon={faFolderOpen} className="text-3xl mb-1 text-gray-300" />
                                        No Image Available
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">{proj.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{proj.description}</p>
                                        
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {proj.technology?.map((tech, i) => (
                                                <span key={i} className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-medium">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-3">
                                            {proj.githubUrl && (
                                                <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-black transition" title="GitHub">
                                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                                    </svg>
                                                </a>
                                            )}
                                            {proj.liveUrl && (
                                                <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-blue-600 transition" title="Live Demo">
                                                    <FontAwesomeIcon icon={faExternalLinkAlt} className="text-sm" />
                                                </a>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => dispatch(openEditModal(proj))}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                                title="Edit"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(proj._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                                title="Delete"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editId ? 'Edit Project' : 'Add New Project'}
                            </h2>
                            <button
                                type="button"
                                onClick={() => dispatch(closeModal())}
                                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer font-bold text-xl"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Project Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={project.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="e.g. Smart Healthcare System"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={project.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Briefly describe the project..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">GitHub URL</label>
                                    <input
                                        type="url"
                                        name="githubUrl"
                                        value={project.githubUrl}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Live Demo URL</label>
                                    <input
                                        type="url"
                                        name="liveUrl"
                                        value={project.liveUrl}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="https://myproject.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Technologies</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={currentTech}
                                        onChange={(e) => setCurrentTech(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="e.g. React, Node.js"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTechClick}
                                        className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-900 transition cursor-pointer"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {project.technology.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-medium border border-blue-100"
                                        >
                                            {tech}
                                            <button
                                                type="button"
                                                onClick={() => dispatch(removeTechnology(index))}
                                                className="text-red-500 font-bold hover:text-red-700 ml-1 cursor-pointer"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Project Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageFileChange}
                                    className="w-full border border-slate-200 rounded-xl p-2 text-xs text-slate-500 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 mb-2 bg-slate-50 cursor-pointer"
                                />
                                
                                {(imageFile || project.imageUrl) && (
                                    <div className="mt-3">
                                        <p className="text-xs text-slate-500 mb-1 font-medium">
                                            {imageFile ? 'New Image Preview:' : 'Current Project Image:'}
                                        </p>
                                        <img
                                            src={imageFile ? URL.createObjectURL(imageFile) : getImageUrl(project.imageUrl)}
                                            alt="Preview"
                                            className="w-full h-36 object-cover rounded-xl border border-slate-200 shadow-sm"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => dispatch(closeModal())}
                                    className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm cursor-pointer"
                                >
                                    {editId ? 'Save Changes' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Project;