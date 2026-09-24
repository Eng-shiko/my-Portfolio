const Bio = require('../models/bioModel');

// getBio
const getBio = async (req, res, next) => {
    try {
        const bio = await Bio.findOne();
        
        if (!bio) {
            return res.status(404).json({
                success: false,
                message: 'Your bio not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Bio fetched successfully', // تصحيح رسالة الجلب
            bio
        });
    } catch (e) {
        next(e);
    }
};

// update bio 
const updateBio = async (req, res, next) => {
    try {
        const bio = await Bio.findOneAndUpdate({}, req.body, {
            new: true,
            upsert: true,
            runValidators: true 
        });

        res.status(200).json({
            success: true,
            message: 'Bio updated successfully',
            bio
        });
    } catch (e) {
        next(e);
    }
};

module.exports = {
    getBio,
    updateBio
};