import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { useRouter } from "next/router";
import { setCookie, parseCookies } from "nookies";
type SignInCredentials = {
    email: string;
    password: string;
}

type User = {
    email: string;
    permissions: string[];
    roles: string[];
}
type AuthContextData = {
    signIn(credentials: SignInCredentials): Promise<void>;
    isAuthenticated: boolean;
    user: User;
}

type AuthProviderProps = {
    children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export default function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>();
    const router = useRouter();
    const isAuthenticated = !!user;


    useEffect(() => {
        const {'nextauth.token': token } = parseCookies();
        if (token) {
            api.get('/me').then(response => {
                const {email, permissions, roles} = response.data;


                setUser({email, permissions, roles});
            })
        }

    }, []);



    async function signIn({email, password}: SignInCredentials){
      try {

          const response = await api.post("/sessions", {
              email,
              password
          });
          const {permissions, roles, token, refreshToken} = response.data;


          setCookie(undefined, "nextauth.token", token, {
              maxAge: 30 * 24 * 60 * 60, // 30 days
                path: "/",
          })
          setCookie(undefined, "nextauth.refreshToken", refreshToken, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: "/",
        })

          setUser({
                email,
                permissions,
                roles
          });

          api.defaults.headers['Authorization'] = `Bearer ${token}`;

          router.push("/dashboard");
      }
       catch (error) {
            console.log(error);
      }
    }
    return (
        <AuthContext.Provider value={{signIn, isAuthenticated,user}}>
            {children}
        </AuthContext.Provider>
    )
}