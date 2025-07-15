import mongoose from "mongoose";
const PropjectSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true, 
        trim:true,
    },
    users:[{
        type:mongoose.Schema.ObjectId,
        ref:'user',
    }]
});

const project=mongoose.model("project",PropjectSchema);
export default project;
