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
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }   
});

const List=mongoose.model('List',listSchema);

module.exports=List;