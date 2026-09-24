const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");

const Auth = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ error: "Authentication required" });
        }
        
        const token = authHeader.replace("Bearer", "").trim();
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        
        const admin = await Admin.findOne({ _id: decode.id, tokens: token });
        
        // تم إضافة return هنا لإيقاف التنفيذ فوراً إذا لم يتم العثور على الأدمن
        if (!admin) {
            return res.status(404).json({ error: "This Admin not found" });
        }
        
        req.admin = admin;
        req.token = token;
        next();
    } catch (e) {
        // تم تعديلها إلى e.message لضمان ظهور رسالة الخطأ بوضوح
        res.status(500).json({ error: e.message });
    }
};

module.exports = Auth;