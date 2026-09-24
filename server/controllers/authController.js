const Admin = require("../models/adminModel");

const registerAdmin = async (req, res, next) => {
    try {
        const adminCount = await Admin.countDocuments();
        if (adminCount > 0) {
            return res.status(403).json({
                success: false,
                error: "Registration is closed. An admin account already exists."
            });
        }

        const admin = new Admin(req.body);
        await admin.save();
        const token = await admin.generateTokens(); 
        res.status(201).json({
            success: true,
            data: `Admin ${admin.username} Added Successfully`,
            token
        });
    } catch (e) {
        next(e);
    }
};

const Login = async (req, res, next) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password);
        
        if (!admin) {
            return res.status(404).json({ success: false, error: "This admin not found" });
        }
        
        const token = await admin.generateTokens();

        res.status(200).json({
            success: true,
            data: `Admin ${admin.username} login Successfully`,
            token
        });
    } catch (e) {
        res.status(400).json({ success: false, error: "Invalid login credentials" });
    }
};

const getAdminProfile = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: { admin: req.admin, token: req.token }
        });
    } catch (e) {
        next(e);
    }
};

const logoutAdmin = async (req, res, next) => {
    try {
        const token = req.token;
        
        req.admin.tokens = req.admin.tokens.filter(toke => toke !== token);
        
        await req.admin.save(); 

        res.status(200).json({
            success: true,
            data: `Admin ${req.admin.username} logout Successfully`
        });
    } catch (e) {
        next(e);
    }
};

module.exports = {
    registerAdmin,
    Login,
    getAdminProfile,
    logoutAdmin
};
