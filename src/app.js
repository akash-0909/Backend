import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({ extended: true,limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());


// Routes
import userRoutes from './routes/user.routes.js';
app.use('/api/v1/users', userRoutes);

import videoRoutes from "./routes/video.routes.js";

app.use("/api/v1/videos", videoRoutes);

import commentRoutes from "./routes/comment.routes.js";

app.use("/api/v1/comments", commentRoutes);

import likeRoutes from "./routes/like.routes.js";

app.use("/api/v1/likes", likeRoutes);

import subscriptionRoutes from "./routes/subscription.routes.js";

app.use("/api/v1/subscriptions", subscriptionRoutes);
export default app;