import userModel from "../models/user.model.js"


export const register = async (req,res)=>{

    const {username, email , password} = req.body

    const isUserExist = await userModel.findOne(
        {$or:[{username} , {email}]}
    )

    if(isUserExist) return res.status(400).json({
        message:"user already exist with this username or email try diffrent",
        success:false,
        error:"user already exist"
    })

    const user =await userModel.create({
        username,
        email,
        password
    })

    res.status(201).json({
        message:"user created sucessfully",
        user,
        success:true
    })

}