import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export default function Dashboard() {
    const {user } = useContext(AuthContext)
    return (
        <div>
            {user?.email}
        </div>
    )
}