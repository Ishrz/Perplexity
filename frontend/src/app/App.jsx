import {router} from "./app.routes.jsx"
import { RouterProvider } from "react-router"
import { useEffect } from "react"
import { useAuth } from "../features/auth/hook/useAuth.js"
function App() {

  const {handelGetMe} = useAuth()

  useEffect(()=>{
    handelGetMe()
  },
  [])

  return (
   <>
   <RouterProvider router={router}/>
   </>
  )
}

export default App
