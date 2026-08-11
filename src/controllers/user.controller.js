import asyncHandler from 'express-async-handler';

const registerUser = asyncHandler(async (req, res) => {
   return res.status(200).json({ message: 'Register User' });
})

export { registerUser };