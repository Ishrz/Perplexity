import userModel from "../models/user.model.js"
import { sendEmail } from "../services/mail.service.js"
import jwt from "jsonwebtoken"

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

    const emailVerificationToken = jwt.sign({email:user.email} , process.env.JWT_SECRET)

    sendEmail({
    to: user.email,
    subject: "Welcome to Perplexity – Your AI Journey Starts Here! ",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 10px; overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #000; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; letter-spacing: 2px;">PERPLEXITY</h1>
        </div>

        <!-- Body -->
        <div style="padding: 30px; line-height: 1.6; color: #333;">
            <h2 style="color: #000;">Hello ${user.username},</h2>
            <p>Welcome to the family! We're thrilled to have you with us.</p>
            <p>Perplexity is designed to help you discover knowledge and find answers faster than ever. Your account has been successfully created, please verify your email first.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/api/v1/auth/verify-email?token=${emailVerificationToken}"
                   style="background-color: #10a37f; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                   Verify Email
                </a>
            </div>

            <p>If you have any questions, feel free to reply to this email. Our team is always here to help.</p>
            
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
            
            <p style="font-size: 12px; color: #888;">
                Best Regards,<br>
                <strong>The Perplexity Team</strong>
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 11px; color: #999;">
            &copy; ${new Date().getFullYear()} Perplexity Inc. | 123 AI Lane, Tech City
        </div>
    </div>
    `
});

    res.status(201).json({
        message:"user created sucessfully",
        user,
        success:true
    })

}

export const verifyEmail = async (req,res) =>{
   try {

     const {token} = req.query
    // console.log(token) 

    const decoded = jwt.verify(token , process.env.JWT_SECRET)

    // console.log(decoded)

    const {email } = decoded

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(404).json({
            message:"token verification faild, user not found",
            success:false,
            error:"user not found"

        })
    }

    user.verified = true;
    user.save()

    res.send(`<html><b>user verification successfull</b></html>`)
    
   } catch (error) {
    return res.status(400).json({
        message:"token verification failed",
        success:false,
        error:error
    })
   }
}

export const login = async (req,res) => {
    try {

        const {email , password} = req.body

    const user = await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(404).json({
            message:"user not found",
            success:false,
            error:"user not ound"
        })
    }

    // console.log(user)
    const isPasswordMatch = await user.comparePassword(password)

    if(!isPasswordMatch){
        return res.status(400).json({
            message:"invalid Credntial , wrong password",
            success:false,
            error:"password not match"
        })
    }

    if(!user.verified){
        return res.status(400).json({
            message:"email is not vverified , please verify first",
            success:false,
            error:"verification failed"
        })
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {expiresIn:"7d"}
    );

    res.cookie('token' ,token)

    res.status(200).json({
        message:"user login successfully",
        success:true,
        user:{
            username:user.username,
            email:user.email,
            id:user._id
        }
    })
        
    } catch (error) {
        return res.status(400).json({
            message:"login failed",
            success:false,
            error:error.stack
        })
    }





}