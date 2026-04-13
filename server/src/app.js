const express =require('express');
const app=express();
const List=require('./models/lists');


app.use(express.json());
app.post('/api/lists',async (req,res)=>{
    try{
        const{name,description,completed,createdAt} = req.body;
        const ListItem=new List({
            name,
            description,
            completed,
            createdAt
        });
        await ListItem.save();
        res.status(201).json(ListItem);
    }
    catch(error){
        res.status(400).json({error:error.message});
    } 
});

app.get('/api/lists',async(req,res)=>{
    try{
        const Lists=await List.find();
        res.status(200).json(Lists);
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

app.patch('/api/lists/:id',async(req,res)=>{
    try{
        const {id}=req.params;
        const {name,description,completed}=req.body;
        const ListItem=await List.findByIdAndUpdate(id,{name,description,completed},{new:true});
        if(!ListItem){
            return res.status(404).json({error:'List item not found'});
        }
        res.status(200).json(ListItem);
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

app.delete('/api/lists/:id',async(req,res)=>{
    try{
        const {id}=req.params;
        const ListItem=await List.findByIdAndDelete(id);
        if(!ListItem){
            return res.status(404).json({error:'List item not found'});
        }
        res.status(200).json({message:'List item deleted successfully'});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
})

module.exports=app;