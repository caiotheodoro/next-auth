import { useContext, useEffect } from "react"
import { Can } from "../components/Can"
import { AuthContext } from "../context/AuthContext"
import { setupApiClient } from "../services/api"
import { api } from "../services/apiClient"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard() {
  

    return (
        <div>

                <div>Métricas</div>

        </div>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx)
    const response = await apiClient.get("/me")


    

    return {
        props: {},
    }

}, {
    permissions: ["metrics.list"],
    roles: ["admininstrator"],
})