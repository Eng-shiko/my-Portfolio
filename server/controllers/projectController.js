const Project = require('../models/projectModel');

const createProject = async (req, res, next) => {
    try {
        const { title, description, githubUrl, liveUrl } = req.body;
        let technology = req.body.technology;

        if (technology && !Array.isArray(technology)) {
            technology = [technology];
        }
        
        if (!req.file) {
            return res.status(400).json({ success: false, error: "Please upload an image" });
        }

        const project = new Project({
            title,
            description,
            imageUrl: req.file.path,
            technology: technology || [],
            githubUrl,
            liveUrl
        });

        await project.save();
        res.status(201).json({ success: true, data: project });
    } catch (e) {
        next(e);
    }
};

const getAllProject = async (req, res, next) => {
    try {
        const projects = await Project.find({});
        res.status(200).json({
            success: true,
            data: projects
        });
    } catch (e) {
        next(e);
    }
};

const getProjectById = async (req, res, next) => {
    try {
        const _id = req.params.id; 
        const project = await Project.findById(_id);
        
        if (!project) {
            return res.status(404).json({ success: false, error: "This project not found" });
        }
        
        res.status(200).json({
            success: true,
            data: project
        });
    } catch (e) {
        next(e);
    }
};

const updateProject = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const project = await Project.findById(_id);
        
        if (!project) {
            return res.status(404).json({ success: false, error: "This project not found" });
        }

        const { title, description, githubUrl, liveUrl } = req.body;
        let technology = req.body.technology;

        if (technology && !Array.isArray(technology)) {
            technology = [technology];
        }

        // تحديث الحقول إذا تم إرسالها
        if (title) project.title = title;
        if (description) project.description = description;
        if (githubUrl !== undefined) project.githubUrl = githubUrl;
        if (liveUrl !== undefined) project.liveUrl = liveUrl;
        if (technology) project.technology = technology;

        // إذا قام المستخدم بررفع صورة جديدة أثناء التعديل
        if (req.file) {
            project.imageUrl = req.file.path;
        }
        
        await project.save();
        
        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: project
        });
    } catch (e) {
        next(e);
    }
};

const deleteProject = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const project = await Project.findByIdAndDelete(_id);
        
        if (!project) {
            return res.status(404).json({ success: false, error: "This project not found" });
        }

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });
    } catch (e) {
        next(e);
    }
};

module.exports = {
    createProject,
    getAllProject,
    getProjectById,
    updateProject,
    deleteProject
};