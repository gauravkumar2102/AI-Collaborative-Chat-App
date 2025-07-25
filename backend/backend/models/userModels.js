import mongoose from 'mongoose';
import bcrypt from 'bcrypt';    
import jwt from 'jsonwebtoken';


const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true, 
        trim:true,
        lowercase:true,
        minLength:[5, 'Email must be at least 5 characters long'],
        maxLength:[50, 'Email must be at most 50 characters long'],
    },
    password:{
        type:String,
        required:true,
        select:false,
        minLength:[6, 'Password must be at least 6 characters long'],
        
    },
});


userSchema.statics.hashPassword = async function (password) {
     return await bcrypt.hash(password, 10);
}

userSchema.methods.validpassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateJWT = function () {
    return jwt.sign({ id: this._id,email: this.email }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    });
}

const User = mongoose.model('user', userSchema);

export default User;
