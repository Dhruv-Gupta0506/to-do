const mongoose=require('mongoose');

async function connectDB(){
    await mongoose.connect(process.env.Mongo_URI);
    console.log('Connected to MongoDB');
}

module.exports=connectDB;