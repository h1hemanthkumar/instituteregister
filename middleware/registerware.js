const path=require('path');
const express=require('express');
const router=express.Router();
const register=require('../databaseschema/register');
const mongoose=require('mongoose');

router.post('/api/register',async(req,res)=>{
    const {username,email,phoneno,course}=req.body;
    if(!username||!email||!phoneno||!course){
        
        res.status(400);
        res.redirect('/');
    }
    const users=await register.findOne({username});

    if(users)
    {   
        res.redirect('/');
    }
    else
    {   const insert=new register({username,email,phoneno,course});
        try{
            insert.save();
            res.status(200).redirect('/');
        }
        catch(err)
        {   res.status(400).redirect('/');
        }
    }

})

module.exports=router;