import userModel from "../models/user.model.js"


export const register = async (req,res)=>{

    const {username, email , password} = req.body

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