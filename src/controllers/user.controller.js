import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
const generateAccessAndRefreshTokens = async(userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
     // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);


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
    if (
        [fullName, email, username, password].some(field => field?.trim() === "")
    ) {
        throw new ApiError(400, 'Please fill all the fields');
    }

    const existedUser = await User.findOne({ $or: [{ email }, { username }] });
    console.log("EMAIL:", email);
    console.log("USERNAME:", username);
    console.log("EXISTED USER:", existedUser);
    if (existedUser) {
        throw new ApiError(409, 'User with email or username already exists');
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, 'Please upload avatar');
    }

    const avatarCloudinaryResponse = await uploadOnCloudinary(avatarLocalPath);
    const coverImageCloudinaryResponse = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatarCloudinaryResponse) {
        throw new ApiError(500, 'Failed to upload avatar to cloudinary');
    }
    if (coverImageLocalPath && !coverImageCloudinaryResponse) {
        throw new ApiError(500, 'Failed to upload cover image to cloudinary');
    }

    const user = await User.create({
        fullName,
        email,
        avatar: avatarCloudinaryResponse.url,
        coverImage: coverImageCloudinaryResponse?.url || "",
        username: username.toLowerCase(),
        password
    })

    const createdUser = await User.findById(user._id).select('-password -refreshToken');
    if (!createdUser) {
        throw new ApiError(500, 'Failed to create user');
    }
    return res.status(201).json(
        new ApiResponse(200, 'User registered successfully', createdUser)
    );
})

const loginUser = asyncHandler(async (req, res) => {
       // get user data from request body
       // validation -not empty, valid email
       // check if user exists
       // check for password match
       // generate access token and refresh token
       // save refresh token to database
       // send response with access token and refresh token

       const { email,username, password } = req.body;

       if(!(username|| email)){
        throw new ApiError(400, 'Please provide email or username');
       }

       const user = await User.findOne({ $or: [{ email }, { username }] });
       if (!user) {
           throw new ApiError(404, 'User not found');
       }
       const isPasswordValid = await user.isPasswordCorrect(password);
       if (!isPasswordValid) {
           throw new ApiError(401, 'Invalid credentials');
       }
       const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
       const options = {
              httpOnly: true,
             secure: process.env.NODE_ENV === 'production',
       }
       // Fetch user data without password and refresh token
       const userData = await User.findById(user._id).select('-password -refreshToken');
       return res.status(200)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshToken", refreshToken, options)
       .json(
           new ApiResponse(200, 'User logged in successfully', {
               accessToken,
               refreshToken,
               user: userData
           })
       );
})

const logoutUser = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new ApiError(400, 'Refresh token not found');
    }
    await User.findOneAndUpdate({ _id: req.user._id }, 
        { refreshToken: null }, 
        { new: true });

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        };

        return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(
            new ApiResponse(200, 'User logged out successfully', null)
        );

})
const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
        if(incomingRefreshToken){
            throw new ApiError(401,"unauthorized request")
        }
    
        const decodedToken=jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET);
    
        const user =await User.findById(decodedToken?._id);
    
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used");
        }
    
        const options ={
            httpOnly:true,
            secure:true
        }
    
        const {accessToken,newRefreshToken}=await generateAccessAndRefreshTokens(user._id);
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken:newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message|| "Invalid refresh Token");
    }
}) 
export { registerUser, loginUser, logoutUser,refreshAccessToken }; 