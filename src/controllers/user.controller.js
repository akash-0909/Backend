import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';
const registerUser = asyncHandler(async (req, res) => {
    // get user data from request body
    // validation -not empty, valid email
    // check if user already exists
    // check for images,check for avatar
    // upload image to cloudinary
    // create user object and save to database
    // remove passsword and refresh token from response
    // check for user created successfully and send response
    // return res

    const { fullName, email, username, password } = req.body;
    //console.log(req.body);
    if(
        [fullName, email, username, password].some(field => field?.trim() === "")
    ) {
        throw new ApiError(400, 'Please fill all the fields');
    }
    
    const existedUser=await User.findOne({ $or: [{ email }, { username }] });

    if(existedUser) {
        throw new ApiError(409, 'User with email or username already exists');
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
     if(!avatarLocalPath) {
        throw new ApiError(400, 'Please upload avatar');
    }
     
    const avatarCloudinaryResponse = await uploadOnCloudinary(avatarLocalPath);
    const coverImageCloudinaryResponse = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if(!avatarCloudinaryResponse) {
        throw new ApiError(500, 'Failed to upload avatar to cloudinary');
    }
    if(coverImageLocalPath && !coverImageCloudinaryResponse) {
        throw new ApiError(500, 'Failed to upload cover image to cloudinary');
    }

    await User.create({
        fullName,
        email,
        avatar: avatarCloudinaryResponse.url,
        coverImage: coverImageCloudinaryResponse?.url || "",
        username: username.toLowerCase(),
        password
    })

    const createdUser=await User.findById(user._id).select('-password -refreshToken');
    if(!createdUser) {
        throw new ApiError(500, 'Failed to create user');
    }
    return res.status(201).json(
        new ApiResponse( 200, 'User registered successfully', createdUser)
    );
})

export { registerUser }; 