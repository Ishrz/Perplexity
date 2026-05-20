import {router} from "./app.routes.jsx"
import { RouterProvider } from "react-router"
function App() {

  return (
   <>
   <div className="flex item-center justify-center">
   <RouterProvider router={router}/>
   </div>
   </>
  )
}

export default App
