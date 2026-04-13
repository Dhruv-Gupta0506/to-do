const mongoose=require('mongoose');

async function connectDB(){
    await mongoose.connect("mongodb+srv://dhruvgupta0506_db_user:iat2WNTnPYI4oRsZ@to-do.3xqtyil.mongodb.net/?appName=to-do");
    console.log('Connected to MongoDB');
}

module.exports=connectDB;