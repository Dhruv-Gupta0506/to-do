const express =require('express');
const app=express();
const List=require('./models/lists');
const cookieParser = require('cookie-parser');
const authRoutes=require('./routes/auth');
const auth=require('./middleware/authMiddleware');




app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRoutes);
app.post('/api/lists',auth,async (req,res)=>{
    try{
        const{name,description,completed,createdAt} = req.body;
        const ListItem=new List({
            name,
            description,
            completed,
            createdAt,
            owner:req.user.id
        });
        await ListItem.save();
        res.status(201).json(ListItem);
    }
    catch(error){
        res.status(400).json({error:error.message});
    } 
});

app.get('/api/lists',auth,async(req,res)=>{
    try{
        const Lists=await List.find({owner:req.user.id});
        res.status(200).json(Lists);
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

app.patch('/api/lists/:id',auth,async(req,res)=>{
    try{
        const {id}=req.params;
        const {name,description,completed}=req.body;
        const ListItem=await List.findOneAndUpdate(
            { _id: id, owner: req.user.id },
            { name, description, completed }, 
            { new: true });
        if(!ListItem){
            return res.status(404).json({error:'List item not found or unauthorized'});
        }
        res.status(200).json(ListItem);
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

app.delete('/api/lists/:id',auth,async(req,res)=>{
    try{
        const {id}=req.params;
        const ListItem=await List.findOneAndDelete(
            { _id: id, owner: req.user.id }
        );
        if(!ListItem){
            return res.status(404).json({error:'List item not found or unauthorized'});
        }
        res.status(200).json({message:'List item deleted successfully'});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
})

module.exports=app;