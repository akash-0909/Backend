import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
/// verify whether the user is authenticated or not
const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
       const accessToken =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");
        if (!accessToken) {
            throw new ApiError(401, 'unauthorized access, please login');
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select('-password -refreshToken');

        if (!user) {
            throw new ApiError(401, 'unauthorized access, please login');
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, 'unauthorized access, please login');
    }
});

export { verifyJWT };