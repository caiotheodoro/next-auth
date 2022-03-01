import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

type UseCanParams = {
    permissions?: string[];
    roles?: string[];
}

export function useCan({permissions, roles}: UseCanParams) {
    const { user, isAuthenticated} = useContext(AuthContext)

    console.log("prds", permissions)
    if (!isAuthenticated) {
        return false
    }

    if( permissions?.length > 0 ) {
        const hasAllPermissions = permissions.some(permission => {
                return user.permissions.includes(permission)
        })
        console.log("hasAllPermissions", permissions)

        if(!hasAllPermissions) {
            return false
        }
    }

    if( roles?.length > 0 ) {
        const hasAllRoles = roles.some(role => {
                return user.roles.includes(role)
        })

        if(!hasAllRoles) {
            return false
        }
    }
    return true
}
