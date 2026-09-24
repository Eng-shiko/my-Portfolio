import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBio } from '../../Redux/bioSlice';
import { fetchExperiences } from '../../Redux/experienceSlice';
import { fetchProjects } from '../../Redux/projectSlice';
import { fetchSkills } from '../../Redux/skillSlice';
import API from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

import profileImage from '../../assets/profile.jpg'; 

// Custom Hook for Scroll Animation
const useOnScreen = (options) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [options]);

    return [ref, isVisible];
};

const AnimatedSection = ({ children, className = "" }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            } ${className}`}
        >
            {children}
        </div>
    );
};

const Home = () => {
    const dispatch = useDispatch();

    const bioState = useSelector((state) => state.bio);
    const bioLoading = useSelector((state) => state.bio?.loading);
    const rawBio = bioState?.bio || bioState;
    const bio = Array.isArray(rawBio) ? rawBio[0] || {} : (rawBio || {});

    const { experiences } = useSelector((state) => state.experiences || { experiences: [] });
    const { projects } = useSelector((state) => state.projects || { projects: [] });
    const { skills } = useSelector((state) => state.skills || { skills: [] });

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Typewriter Effect State
    const [typedText, setTypedText] = useState('');
    const fullTitle = " Full Stack Web Developer";

    useEffect(() => {
        dispatch(fetchBio());
        dispatch(fetchExperiences());
        dispatch(fetchProjects());
        dispatch(fetchSkills());
    }, [dispatch]);

    // Typewriter Animation Logic on Page Load
    useEffect(() => {
        let index = 0;
        setTypedText(''); 
        const timer = setInterval(() => {
            if (index < fullTitle.length) {
                setTypedText((prev) => prev + fullTitle.charAt(index));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 100);

        return () => clearInterval(timer);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            await API.post('/messages/message', formData);
            setSuccessMessage('Thank you! Your message has been sent successfully.');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (bioLoading) {
        return (
            <div className="min-h-screen bg-[#0b0f19] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">
            
            {/* Custom CSS for Blob Morphing Animation */}
            <style>{`
                @keyframes morphBlob {
                    0% {
                        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    }
                    50% {
                        border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
                    }
                    100% {
                        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    }
                }
                .animate-blob-morph {
                    animation: morphBlob 8s ease-in-out infinite;
                }
            `}</style>

            {/* Navigation Bar */}
            <Navbar bio={bio} />

            {/* Hero Section */}
            <header className="relative overflow-hidden py-16 lg:py-28 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[80vh]">
                
                {/* Left Side: Animated Text & Actions */}
                <div className="lg:col-span-7 flex flex-col items-start text-left z-10 space-y-6">
                    
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold tracking-wide uppercase shadow-lg shadow-orange-500/5 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                        Welcome to my portfolio
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
                        Hi, <br />
                        I'm <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">{bio?.name || 'Shaban Aboelkair'}</span> <br />
                        
                        <span className="text-slate-300 text-2xl sm:text-4xl font-bold mt-3 block tracking-wide min-h-[1.5em]">
                            {typedText}
                            <span className="animate-pulse text-orange-400 font-light ml-1">|</span>
                        </span>
                    </h1>

                    <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
                        {bio?.headline || 'Building modern, scalable, and high-performance digital experiences.'}
                    </p>

                    <div className="pt-2">
                        <a 
                            href="#contact" 
                            className="inline-block px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-lg shadow-orange-600/30 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-orange-500/50"
                        >
                            Contact
                        </a>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex items-center gap-6 pt-4 text-slate-400">
                        {bio?.linkedin && bio.linkedin !== '...........' && (
                            <a href={bio.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-all duration-300 transform hover:scale-110 text-lg flex items-center gap-2">
                                <i className="fab fa-linkedin-in text-orange-500"></i> LinkedIn
                            </a>
                        )}
                        {bio?.github && (
                            <a href={bio.github} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-all duration-300 transform hover:scale-110 text-lg flex items-center gap-2">
                                <i className="fab fa-github text-orange-500"></i> GitHub
                            </a>
                        )}
                    </div>
                </div>

                {/* Right Side: Organic Blob Image with Continuous Morphing Animation */}
                <div className="lg:col-span-5 flex justify-center z-10">
                    <div className="relative w-72 sm:w-80 lg:w-96 h-72 sm:h-80 lg:h-96 flex items-center justify-center group">
                        
                        {/* Background Glowing/Offset Blob Layer */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/40 via-amber-500/30 to-orange-600/30 animate-blob-morph filter blur-xl opacity-75"></div>

                        {/* Main Organic Blob Image Container */}
                        <div className="relative w-64 sm:w-72 lg:w-84 h-64 sm:h-72 lg:h-84 overflow-hidden shadow-2xl bg-slate-900 border-2 border-orange-500/60 animate-blob-morph transition-transform duration-500 group-hover:scale-105">
                            <img 
                                src={profileImage} 
                                alt={bio?.name || 'Shaban Aboelkair'} 
                                className="w-full h-full object-cover object-top transform scale-110 transition-transform duration-700 group-hover:scale-125"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* About Section */}
            <AnimatedSection>
                <section id="about" className="py-20 px-6 sm:px-12 lg:px-24 max-w-4xl mx-auto">
                    <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:border-orange-500/40 hover:-translate-y-1">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-orange-500 animate-ping"></span>
                            About Me
                        </h2>
                        <p className="text-slate-300 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                            {bio?.aboutText || 'Passionate developer dedicated to writing clean code and building scalable applications.'}
                        </p>
                    </div>
                </section>
            </AnimatedSection>

            {/* Projects Section */}
            {projects && projects.length > 0 && (
                <AnimatedSection>
                    <section id="works" className="py-20 px-6 sm:px-12 lg:px-24 max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Works / Projects</h2>
                            <p className="text-slate-400 text-sm sm:text-base">A selection of things I've built recently</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {projects.map((project) => (
                                <div 
                                    key={project._id || project.id} 
                                    className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 hover:border-orange-500/50 hover:-translate-y-2 flex flex-col group"
                                >
                                    <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                                        {project.imageUrl || project.image ? (
                                            <img 
                                                src={project.imageUrl || project.image} 
                                                alt={project.title} 
                                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-950/30 to-slate-900 text-orange-400 font-bold text-xl">
                                                {project.title}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">{project.title}</h3>
                                            <p className="text-slate-300 text-sm mb-8 leading-relaxed line-clamp-3">{project.description}</p>
                                        </div>
                                        <div className="flex items-center gap-4 pt-4 border-t border-slate-800/80">
                                            {project.liveUrl && (
                                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 text-xs font-semibold">
                                                    Live Demo &rarr;
                                                </a>
                                            )}
                                            {project.githubUrl && (
                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700">
                                                    GitHub Repository
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </AnimatedSection>
            )}

            {/* Skills Section */}
            {skills && skills.length > 0 && (
                <AnimatedSection>
                    <section id="skills" className="py-20 px-6 sm:px-12 lg:px-24 max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Technical Skills</h2>
                            <p className="text-slate-400 text-sm sm:text-base">Technologies and tools I work with</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {skills.map((skill, index) => {
                                const proficiency = skill.proficiency || skill.level || 85;
                                return (
                                    <div key={skill._id || index} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-[2rem] shadow-xl transition-all duration-300 hover:border-orange-500/50 hover:-translate-y-1.5 flex flex-col justify-between group">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xl shrink-0 group-hover:bg-orange-500/20 transition-all">
                                                {skill.icon ? <i className={skill.icon}></i> : (skill.name ? skill.name.charAt(0) : 'S')}
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="text-lg font-bold text-white mb-2">{skill.name}</h3>
                                                {skill.category && (
                                                    <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-xs font-medium border border-orange-500/20">
                                                        {skill.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-full h-px bg-slate-800/80 mb-6"></div>
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-semibold text-slate-400 tracking-wider">PROFICIENCY</span>
                                                <span className="text-sm font-bold text-orange-400">{proficiency}%</span>
                                            </div>
                                            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
                                                <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-1000" style={{ width: `${proficiency}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </AnimatedSection>
            )}

            {/* Contact Section */}
            <AnimatedSection>
                <section id="contact" className="py-24 px-6 sm:px-12 lg:px-24 max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Let's Build Something Together</h2>
                        <p className="text-slate-400 text-sm sm:text-base">Have a question or want to work together? Drop me a message.</p>
                    </div>

                    <form onSubmit={handleContactSubmit} className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl space-y-6">
                        {successMessage && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm">
                                {successMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
                                {errorMessage}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-orange-500 transition-all" placeholder="John Doe" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-orange-500 transition-all" placeholder="john@example.com" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Message</label>
                            <textarea name="message" rows="4" value={formData.message} onChange={handleChange} required className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-orange-500 transition-all resize-none" placeholder="Write your message here..." />
                        </div>

                        <button type="submit" disabled={submitting} className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-xl shadow-orange-600/30 transition-all disabled:opacity-50">
                            {submitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </section>
            </AnimatedSection>

            {/* Footer */}
            <Footer bio={bio} />
        </div>
    );
};

export default Home;