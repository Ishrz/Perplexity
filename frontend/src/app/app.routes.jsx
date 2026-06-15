import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "../features/auth/components/Protected.jsx"
import Public from "../features/auth/components/Public.jsx";

export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Public><Login/></Public>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/",
        element:<Protected>
            <Dashboard/>
        </Protected>
    }
])