import userModel from '../models/userModels.js';


export const createUser = async (email,password) => {
      if(!email || !password) {
          throw new Error('Email and password are required');
      }
  
      const hashedPassword = await userModel.hashPassword(password);
      
      const user = new userModel({
          email,
          password: hashedPassword
      });
       await user.save();
       
      return user;

}

export const loginUser = async (email, password) => {
    if (!email || !password) {
        throw new Error('Email and password are required');
        
    }

    const user = await userModel.findOne({ email }).select('+password');
    // console.log(user);
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isValidPassword = await user.validpassword(password);

    if (!isValidPassword) {
        throw new Error('Invalid email or password');
    } 
    
    return user;
}

export const getAllUsers = async ({ userid }) => {
    if (!userid) throw new Error("User ID is required");

    const userdata = await userModel.find({ _id: { $ne: userid } }).select('-password');
    return userdata;
}