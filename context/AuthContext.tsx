import { createContext, useEffect, useState } from "react";
import {  api } from "../services/apiClient";
import { useRouter } from "next/router";
import Router from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies";
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
    signIn: (credentials: SignInCredentials) => Promise<void>;
    signOut: () => void;
    isAuthenticated: boolean;
    user: User;
}

type AuthProviderProps = {
    children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel

export function signOut() {
    destroyCookie(undefined, "nextauth.token");
    destroyCookie(undefined, "nextauth.refreshToken");

    authChannel.postMessage('signOut');

    Router.push("/");
}	

export default function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>();
    const router = useRouter();
    const isAuthenticated = !!user;


    useEffect(() => {
        authChannel = new BroadcastChannel('auth');

        authChannel.onmessage = (message) => {
            switch (message.data) {
                case 'signOut':
                    signOut();
                    break;
               
                default:
                    break;

            }
        }
    } , []);

    useEffect(() => {
        const {'nextauth.token': token } = parseCookies();
        if (token) {
            api.get('/me').then(response => {
                const {email, permissions, roles} = response.data;

                setUser({email, permissions, roles});
            }).catch(() => {
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
        <AuthContext.Provider value={{signIn, signOut, isAuthenticated,user}}>
            {children}
        </AuthContext.Provider>
    )
}