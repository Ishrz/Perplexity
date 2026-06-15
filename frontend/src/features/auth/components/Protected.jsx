import { useSelector } from "react-redux"
import { Navigate } from "react-router"
const Protected = ({children}) =>{
    const user = useSelector(state => state.auth.user)
    const loading = useSelector( state => state.auth.loading)

    console.group("from protected component")
    console.log(user)
    console.log(loading)
    console.groupEnd()

    if(loading){
        return <h1>Loading......</h1>
    }

    if(!user){
        return <Navigate to="/login" replace/>
    }

    return(
        children
    )
}

export default Protected