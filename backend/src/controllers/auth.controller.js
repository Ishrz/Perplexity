


export const register = async (req,res)=>{

    const {username, email , password} = req.body

    res.status(201).json({
        message:"user created sucessfully",
        user:{username,email,password},
        success:true
    })

}