import { useSelector } from "react-redux"
const Dashboard = () => {

    const user = useSelector(state => state.auth)
    console.log(user)
  return (
    <div>
      <h1>DashBoard</h1>
    </div>
  )
}

export default Dashboard
