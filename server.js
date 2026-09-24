const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const errorHandler = require('./server/middleware/errorMiddleware')
const authRoutes = require('./server/routes/authRoutes');
const projectRoutes = require('./server/routes/projectRoutes');
const skillRoutes = require('./server/routes/skillRoutes');
const experienceRoutes = require('./server/routes/experienceRoutes');
const bioRoutes = require('./server/routes/bioRoutes');
const messageRoutes = require('./server/routes/messageRoutes');


const app = express();

app.use(helmet()); 
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));


app.use(express.json({ limit: '10kb' }));


app.use((req, res, next) => {
    if (req.body) {
        const sanitizeData = (obj) => {
            for (let key in obj) {
                if (key.startsWith('$') || key.includes('.')) {
                    delete obj[key];
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitizeData(obj[key]);
                }
            }
        };
        sanitizeData(req.body);
    }
    next();
});
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, error: "Too many requests from this IP, please try again after 15 minutes" }
});

app.use('/api/auth', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/bio', bioRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: "Portfolio Backend is running successfully!" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Database Connected Successfully ');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} `);
        });
    })
    .catch((err) => {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    });