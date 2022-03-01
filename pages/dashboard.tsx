import { destroyCookie } from "nookies"
import { useContext, useEffect } from "react"
import { Can } from "../components/Can"
import { AuthContext } from "../context/AuthContext"
import { useCan } from "../hooks/useCan"
import { setupApiClient } from "../services/api"
import { api } from "../services/apiClient"
import { AuthTokenError } from "../services/errors/AuthTokenError"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard() {
    const { user } = useContext(AuthContext)



    useEffect(() => {
        api.get("/me").then(response => {
            console.log(response.data)
        }).catch((err) => { console.log(err) })
    }, [])

    return (
        <div>
            {user?.email}
            <Can permissions={['metrics.list']}>

                <div>Métricas</div>

            </Can>
        </div>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx)
    const response = await apiClient.get("/me")

    console.log(response.data)

    return {
        props: {},
    }

})