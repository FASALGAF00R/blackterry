const e = require('express');
const Address=require('./addressModel');

const addaddress=async(req,res)=>{
    try {
        const {userid,firstname,lastname,number,address,city,state,country}=req.body; 
        console.log(userid,"oooooo");
        
    
        const newaddress=new Address({
            userid,
            firstname,
            lastname,
            number,
            address,
            city,   
            state,
            country,
        });
        await newaddress.save();
        res.status(201).json({message:"Address added successfully",address:newaddress})
    } catch (error) {
        console.log(error.message);
    }
}

const getspecificaddress=async(req,res)=>{
    try {
        console.log("enteredddddd");
        
        const addressid=req.params.id;
        console.log(addressid,"lllllll");
        
        const address=await Address.find({userid:addressid});
        console.log(address,"......");
        
        if(!address){
            return res.status(404).json({message:"Address not found"});
        }   
        res.status(200).json({address});
    } catch (error) {
        console.log(error.message);
    }
}


const updateaddress=async(req,res)=>{
    try {
        const addressid=req.params.id;
        const updatedaddress=req.body;
        console.log(updateaddress,"...........");
        
        const addressupdate=await Address.findByIdAndUpdate(addressid,updatedaddress,{new:true})
        if(!addressupdate){
            return res.status(404).json({message:"Address not found"});
        }else{

           return res.status(200).json({ message: "Address updated successfully", address: addressupdate });
        }
    
    } catch (error) {
        console.log(error.message);
    }
}



const deleteaddress=async(req,res)=>{
    try {
        console.log("ethiiiiiiiiiiiiiiii");
        const id=req.params.id
        
        const Deleteuser=await Address.findByIdAndDelete(id)
        if(!Deleteuser){
            return res.status(404).json({message:"address not found"})
        }else{

            return res.status(200).json({message:"addreass deleted",Deleteuser})
        }

        
    } catch (error) {
        console.log(error.message);
        
    }
}


module.exports={
    addaddress,
    getspecificaddress,
    updateaddress,
    deleteaddress
}