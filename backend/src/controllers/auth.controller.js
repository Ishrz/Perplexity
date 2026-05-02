import userModel from "../models/user.model.js"
import { sendEmail } from "../services/mail.service.js"

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
            <p>Perplexity is designed to help you discover knowledge and find answers faster than ever. Your account has been successfully created, and you're all set to start exploring.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://your-app-link.com/login" 
                   style="background-color: #10a37f; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                   Start Exploring
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