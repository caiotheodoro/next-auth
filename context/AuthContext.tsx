import { createContext, useState } from "react";
import { api } from "../services/api";
import { useRouter } from "next/router";

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
    const isAuthenticated = !!user?.email;

    async function signIn({email, password}: SignInCredentials){
      try {

          const response = await api.post("/sessions", {
              email,
              password
          });
          const {permissions, roles, token, refreshToken} = response.data;
          setUser({
                email,
                permissions,
                roles
          });

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