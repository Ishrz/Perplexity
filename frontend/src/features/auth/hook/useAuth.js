import { useDispatch } from "react-redux";
import { setLoading, setError,setUser } from "../auth.slice";
import { register, login,getMe } from "../service/auth.api";


export const useAuth = () =>{

    const dispatch = useDispatch()

    const handelRegister = async ({username,password,email}) => {
        try{
            dispatch( setLoading(true) )

            const data= await register({username,password,email})

        }catch(error){
            dispatch( setError(error.response?.data?.message || "registeration failed"))
        }finally{
            dispatch( setLoading(false))
        }
    }

    const handelLogin = async ({email, password}) => {
        try{
            dispatch(setLoading(true))
            const data = await login({email,password})
            dispatch( setUser(data.user))

        }catch(error){

            dispatch( setLoading(error.response?.data?.message || "login failed"))

        }finally{
           dispatch( setLoading(false) )
        }
    }

    const handelGetMe = async () =>{
        try{
            dispatch( setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        }catch(error){
            dispatch( setLoading(error.response?.data?.message) || "please register or login" )
        }finally{
            dispatch( setLoading(false))
        }
    }

    return{
        handelLogin,
        handelRegister,
        handelGetMe
    }


}