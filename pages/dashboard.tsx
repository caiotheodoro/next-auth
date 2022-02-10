import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { api } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard() {
    const {user } = useContext(AuthContext)

    useEffect(() => {
        api.get("/me").then(response => {
            console.log(response.data)
        }).catch((err) => { console.log(err) }  )
    },[])

    return (
        <div>
            {user?.email}
        </div>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {

    return {
        props: {},
    }
    
})