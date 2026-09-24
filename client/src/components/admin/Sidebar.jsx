import { Link, useNavigate } from 'react-router-dom';
import meImage from '../../assets/sidebar.jpg';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faCode, faEnvelope, faGear, faBriefcase, faAddressCard, faRightFromBracket, faHouse } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navLinks = [
        { name: 'View Site', path: '/', icon: faHouse }, 
        { name: 'Manage Projects', path: 'projects', icon: faFolderOpen },
        { name: 'Skills', path: 'skills', icon: faCode },
        { name: 'Experience', path: 'experience', icon: faBriefcase },
        { name: 'Bio', path: 'bio', icon: faAddressCard },
        { name: 'Messages', path: 'messages', icon: faEnvelope },
    ];

    return (
        <aside className={`bg-gray-900 text-gray-300 h-screen sticky top-0 shadow-2xl transition-all duration-300 flex flex-col justify-between ${isExpanded ? 'w-64' : 'w-20'}`}>
            <div>
                {/* Image and open/close sidebar */}
                <div className="p-4 border-b border-gray-800 flex items-center">
                    <div className={`flex items-center gap-3 w-full ${!isExpanded ? 'justify-center' : ''}`}>
                        <img 
                            src={meImage} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-blue-500 shadow-md hover:scale-105 transition duration-200 shrink-0" 
                            onClick={() => setIsExpanded(!isExpanded)}
                            title="Click to toggle sidebar"
                        />
                        {isExpanded && (
                            <div className="overflow-hidden whitespace-nowrap">
                                <h3 className="text-white font-semibold text-sm tracking-wide">Admin Portal</h3>
                                <span className="text-xs text-green-400 font-medium">● Active</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="p-3 space-y-1.5">
                    {navLinks.map((link, index) => (
                        <Link 
                            key={index}
                            to={link.path} 
                            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition duration-200 group ${link.path === '/' ? 'text-teal-400 hover:text-teal-300 bg-gray-800/50' : ''}`}
                            title={!isExpanded ? link.name : ''}
                        >
                            <FontAwesomeIcon 
                                icon={link.icon} 
                                className={`w-5 h-5 shrink-0 ${link.path === '/' ? 'text-teal-400' : 'text-blue-400 group-hover:text-blue-300'}`} 
                            />
                            {isExpanded && (
                                <div className='flex justify-between items-start'>
                                    <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                        {link.name}
                                    </span>
                                </div>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Logout and Settings */}
            <div className="space-y-2 p-3 border-t border-gray-800">
                <button
                    className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition duration-200 group"
                    title={!isExpanded ? 'Settings' : ''}
                >
                    <FontAwesomeIcon icon={faGear} className="w-5 h-5 shrink-0" />
                    {isExpanded && <span className="text-sm whitespace-nowrap">Settings</span>}
                </button>

                <button 
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg font-medium transition duration-200 group ${!isExpanded ? 'justify-center' : ''}`}
                    title={!isExpanded ? 'Logout' : ''}
                >
                    <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5 shrink-0" />
                    {isExpanded && <span className="text-sm whitespace-nowrap">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;