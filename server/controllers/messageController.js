const Message = require('../models/messageModel');
const nodemailer = require('nodemailer');
const createMessage = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;

        const newMessage = new Message({ name, email, message });
        await newMessage.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS  
            }
        });

        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: ` New Portfolio Message from ${name}`,
            text: `You have received a new message from your portfolio:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            success: true,
            message: "Message sent and saved successfully",
            data: newMessage
        });

    } catch (e) {
        next(e);
    }
};

module.exports = createMessage;
const getMessage = async (req, res, next) => {
    try {
        const messages = await Message.find(); 
        
        if (!messages || messages.length === 0) {
            return res.status(404).json({
                success: false,
                message: "You have 0 messages"
            });
        }
        
        res.status(200).json({
            success: true,
            count: messages.length,
            messages
        });
    } catch (e) {
        next(e);
    }
};

const updateStatus = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not exist'
            });
        }
        
        message.isRead = true;
        await message.save();
        
        res.status(200).json({
            success: true,
            text: 'Status updated successfully',
            message
        });
    } catch (e) {
        next(e);
    }
};

const deleteMessage = async (req, res, next) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not exist'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Message is deleted'
        });
    } catch (e) {
        next(e);
    }
};

module.exports = {
    createMessage,
    getMessage,
    updateStatus,
    deleteMessage
};