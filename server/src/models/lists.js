const mongoose=require('mongoose');

const listSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    completed:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }   
});

const List=mongoose.model('List',listSchema);

module.exports=List;